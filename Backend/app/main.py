"""
FastAPI application - WanderGenie Backend
"""
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from datetime import datetime
import sys

from app.config import get_settings
from app.db import ensure_vector_index, get_users_collection, get_database
from app.schemas import (
    PlanRequest, Itinerary, HealthResponse, IngestRequest,
    UserCreate, UserLogin, UserResponse, Token
)
from app.generate import generate_itinerary
from app.ingest import ingest_document
from app.auth import hash_password, authenticate_user, create_access_token, get_current_user
from app import __version__


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events"""
    # Startup
    print("🚀 Starting WanderGenie Backend...")
    settings = get_settings()
    print(f"✓ Loaded configuration")
    print(f"✓ Database: {settings.db_name}")
    print(f"✓ Collection: {settings.collection_name}")
    
    # Check vector index
    try:
        ensure_vector_index()
    except Exception as e:
        print(f"⚠️  Could not verify vector index: {e}")
    
    yield
    
    # Shutdown
    print("👋 Shutting down WanderGenie Backend...")


# Initialize FastAPI app
app = FastAPI(
    title="WanderGenie API",
    description="AI-Powered Travel Planner using RAG with Google Gemini",
    version=__version__,
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["Root"])
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to WanderGenie API",
        "version": __version__,
        "docs": "/docs"
    }


@app.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """
    Health check endpoint
    """
    settings = get_settings()
    
    return HealthResponse(
        status="healthy",
        version=__version__,
        database=settings.db_name
    )


@app.post("/plan", response_model=Itinerary, tags=["Planning"])
async def plan_trip(
    request: PlanRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Generate a travel itinerary using RAG (Protected - requires authentication).
    
    - **destination**: Travel destination (e.g., "Tokyo, Japan")
    - **days**: Number of days (1-30)
    - **budget**: Total budget in USD
    - **travel_style**: Preferred travel style
    
    Returns a structured day-by-day itinerary with attractions, costs, and tips.
    Saves the itinerary to user's history.
    """
    try:
        # Generate itinerary
        itinerary = generate_itinerary(request)
        
        # Save to database with user_id
        itineraries_collection = get_database()["itineraries"]
        itinerary_doc = {
            "user_id": str(current_user["_id"]),
            "user_email": current_user["email"],
            "destination": itinerary.destination,
            "total_days": itinerary.total_days,
            "total_budget": itinerary.total_budget,
            "travel_style": itinerary.travel_style,
            "itinerary_data": itinerary.model_dump(),
            "created_at": datetime.utcnow().isoformat()
        }
        result = itineraries_collection.insert_one(itinerary_doc)
        
        # Add ID to response
        itinerary_dict = itinerary.model_dump()
        itinerary_dict["_id"] = str(result.inserted_id)
        
        return itinerary
    except Exception as e:
        print(f"❌ Error generating itinerary: {e}", file=sys.stderr)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate itinerary: {str(e)}"
        )


@app.post("/ingest", tags=["Admin"])
async def ingest_travel_document(request: IngestRequest):
    """
    Ingest a travel document (admin/testing endpoint).
    
    - **text**: Document text content
    - **metadata**: Document metadata (type, destination, etc.)
    
    Returns the number of chunks created.
    """
    try:
        num_chunks = ingest_document(request.text, request.metadata)
        return {
            "message": "Document ingested successfully",
            "chunks_created": num_chunks,
            "metadata": request.metadata
        }
    except Exception as e:
        print(f"❌ Error ingesting document: {e}", file=sys.stderr)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to ingest document: {str(e)}"
        )


@app.get("/itineraries", tags=["Planning"])
async def get_user_itineraries(current_user: dict = Depends(get_current_user)):
    """
    Get all itineraries for the current logged-in user.
    
    Requires: Authorization header with Bearer token
    
    Returns list of past trip itineraries ordered by creation date (newest first).
    """
    try:
        itineraries_collection = get_database()["itineraries"]
        
        # Find all itineraries for this user
        user_itineraries = list(
            itineraries_collection.find(
                {"user_id": str(current_user["_id"])}
            ).sort("created_at", -1)  # Newest first
        )
        
        # Format response
        result = []
        for doc in user_itineraries:
            result.append({
                "id": str(doc["_id"]),
                "destination": doc["destination"],
                "total_days": doc["total_days"],
                "total_budget": doc["total_budget"],
                "travel_style": doc["travel_style"],
                "created_at": doc["created_at"],
                "itinerary": doc["itinerary_data"]
            })
        
        return {
            "count": len(result),
            "itineraries": result
        }
        
    except Exception as e:
        print(f"❌ Error fetching itineraries: {e}", file=sys.stderr)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch itineraries: {str(e)}"
        )


# ============= Authentication Endpoints =============

@app.post("/auth/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED, tags=["Authentication"])
async def register(user_data: UserCreate):
    """
    Register a new user account.
    
    - **email**: User email (must be unique)
    - **name**: User's full name  
    - **password**: Password (min 6 characters)
    
    Returns created user information (without password).
    """
    users_collection = get_users_collection()
    
    # Check if user already exists
    existing_user = users_collection.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create user document
    user_doc = {
        "email": user_data.email,
        "name": user_data.name,
        "hashed_password": hash_password(user_data.password),
        "created_at": datetime.utcnow().isoformat()
    }
    
    # Insert into database
    result = users_collection.insert_one(user_doc)
    
    # Return user response
    return UserResponse(
        id=str(result.inserted_id),
        email=user_doc["email"],
        name=user_doc["name"],
        created_at=user_doc["created_at"]
    )


@app.post("/auth/login", response_model=Token, tags=["Authentication"])
async def login(credentials: UserLogin):
    """
    Login with email and password to receive a JWT token.
    
    - **email**: User email
    - **password**: User password
    
    Returns JWT access token and user information.
    """
    # Authenticate user
    user = authenticate_user(credentials.email, credentials.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token = create_access_token(
        data={"sub": str(user["_id"]), "email": user["email"]}
    )
    
    # Return token and user info
    return Token(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse(
            id=str(user["_id"]),
            email=user["email"],
            name=user["name"],
            created_at=user["created_at"]
        )
    )


@app.get("/auth/me", response_model=UserResponse, tags=["Authentication"])
async def get_me(current_user: dict = Depends(get_current_user)):
    """
    Get current authenticated user information.
    
    Requires: Authorization header with Bearer token
    
    Returns current user's profile.
    """
    return UserResponse(
        id=str(current_user["_id"]),
        email=current_user["email"],
        name=current_user["name"],
        created_at=current_user["created_at"]
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

