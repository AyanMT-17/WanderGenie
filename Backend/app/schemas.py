"""
Pydantic schemas for request/response validation
"""
from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum


class TravelStyle(str, Enum):
    """Travel style preferences"""
    ADVENTURE = "adventure"
    RELAXATION = "relaxation"
    CULTURAL = "cultural"
    LUXURY = "luxury"
    BUDGET = "budget"
    FAMILY = "family"


class PlanRequest(BaseModel):
    """Request schema for /plan endpoint"""
    destination: str = Field(..., description="Travel destination (e.g., 'Paris, France')")
    days: int = Field(..., ge=1, le=30, description="Number of days (1-30)")
    budget: float = Field(..., gt=0, description="Total budget in USD")
    travel_style: TravelStyle = Field(..., description="Preferred travel style")
    
    class Config:
        json_schema_extra = {
            "example": {
                "destination": "Tokyo, Japan",
                "days": 5,
                "budget": 3000,
                "travel_style": "cultural"
            }
        }


class Attraction(BaseModel):
    """Single attraction/activity"""
    name: str
    description: str
    duration: str
    estimated_cost: float


class DayItinerary(BaseModel):
    """Itinerary for a single day"""
    day: int
    title: str
    morning: List[Attraction]
    afternoon: List[Attraction]
    evening: List[Attraction]
    accommodation: str
    daily_budget: float


class TransportInfo(BaseModel):
    """Transportation information"""
    type: str  # e.g., "Flight", "Train", "Local Transport"
    details: str
    estimated_cost: float


class Itinerary(BaseModel):
    """Complete itinerary response"""
    destination: str
    total_days: int
    total_budget: float
    travel_style: str
    days: List[DayItinerary]
    transport: List[TransportInfo]
    tips: List[str]
    

class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    version: str
    database: str


class IngestRequest(BaseModel):
    """Request schema for document ingestion (admin/testing)"""
    text: str = Field(..., description="Document text to ingest")
    metadata: dict = Field(default_factory=dict, description="Document metadata")
    
    class Config:
        json_schema_extra = {
            "example": {
                "text": "Tokyo is the capital of Japan. Must-visit places include Senso-ji Temple, Tokyo Tower, and Shibuya Crossing.",
                "metadata": {
                    "type": "city_guide",
                    "destination": "Tokyo",
                    "category": "attractions"
                }
            }
        }


# ============= Authentication Schemas =============

class UserBase(BaseModel):
    """Base user schema"""
    email: str = Field(..., description="User email address")
    name: str = Field(..., description="User's full name")


class UserCreate(UserBase):
    """User registration schema"""
    password: str = Field(..., min_length=6, description="Password (min 6 characters)")
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "name": "John Doe",
                "password": "securepass123"
            }
        }


class UserLogin(BaseModel):
    """User login schema"""
    email: str = Field(..., description="User email")
    password: str = Field(..., description="User password")
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "password": "securepass123"
            }
        }


class UserResponse(UserBase):
    """User response schema (no password)"""
    id: str = Field(..., description="User ID")
    created_at: str = Field(..., description="Account creation timestamp")
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": "507f1f77bcf86cd799439011",
                "email": "user@example.com",
                "name": "John Doe",
                "created_at": "2025-12-20T23:00:00Z"
            }
        }


class Token(BaseModel):
    """JWT token response"""
    access_token: str = Field(..., description="JWT access token")
    token_type: str = Field(default="bearer", description="Token type")
    user: UserResponse = Field(..., description="User information")
    
    class Config:
        json_schema_extra = {
            "example": {
                "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "token_type": "bearer",
                "user": {
                    "id": "507f1f77bcf86cd799439011",
                    "email": "user@example.com",
                    "name": "John Doe",
                    "created_at": "2025-12-20T23:00:00Z"
                }
            }
        }


class TokenData(BaseModel):
    """Token payload data"""
    user_id: Optional[str] = None
    email: Optional[str] = None

