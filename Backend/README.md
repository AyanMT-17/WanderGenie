# WanderGenie Backend

AI-Powered Travel Planner using Retrieval-Augmented Generation (RAG) with Google Gemini and MongoDB Atlas Vector Search.

## 🏗️ Architecture

- **API Framework**: FastAPI
- **LLM**: Google Gemini (gemini-1.5-flash)
- **Embeddings**: Gemini Embedding (text-embedding-004)
- **Database**: MongoDB Atlas
- **Vector Search**: MongoDB Atlas Vector Search (cosine similarity, 768 dimensions)

## 📁 Project Structure

```
Backend/
├── app/
│   ├── __init__.py          # Package initialization
│   ├── main.py              # FastAPI application
│   ├── config.py            # Configuration management
│   ├── db.py                # MongoDB connection
│   ├── schemas.py           # Pydantic models
│   ├── embeddings.py        # Gemini embedding generation
│   ├── ingest.py            # Document ingestion
│   ├── retrieve.py          # Vector search retrieval
│   └── generate.py          # RAG itinerary generation
├── .env                     # Environment variables (create from .env.example)
├── .env.example             # Environment template
└── requirements.txt         # Python dependencies
```

## 🚀 Setup Instructions

### 1. Prerequisites

- Python 3.9+
- MongoDB Atlas account
- Google Gemini API key

### 2. MongoDB Atlas Setup

1. Create a MongoDB Atlas cluster (free tier works)
2. Create a database named `wandergenie`
3. Create a collection named `travel_documents`
4. **Create Vector Search Index**:
   - Go to Atlas → Database → Browse Collections
   - Select `wandergenie.travel_documents`
   - Click "Search Indexes" tab → "Create Search Index"
   - Choose "JSON Editor" and paste:

```json
{
  "fields": [
    {
      "type": "vector",
      "path": "embedding",
      "numDimensions": 768,
      "similarity": "cosine"
    },
    {
      "type": "filter",
      "path": "metadata.type"
    }
  ]
}
```

   - Name it: `vector_index`
   - Wait for index to build (takes 2-5 minutes)

5. Get your connection string from "Connect" → "Connect your application"

### 3. Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Copy the key

### 4. Install Backend

```bash
# Navigate to Backend directory
cd Backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 5. Configure Environment

```bash
# Copy example env file
cp .env.example .env

# Edit .env with your credentials
```

Update `.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
DB_NAME=wandergenie
COLLECTION_NAME=travel_documents
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

### 6. Ingest Sample Data (Optional)

```bash
# From Python shell
python

>>> from app.ingest import ingest_sample_data
>>> ingest_sample_data()
```

This will ingest sample data for Tokyo, Paris, and New York.

### 7. Run Server

```bash
uvicorn app.main:app --reload
```

Server will start at: `http://localhost:8000`

## 📡 API Endpoints

### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "database": "wandergenie"
}
```

### Plan Trip
```http
POST /plan
Content-Type: application/json

{
  "destination": "Tokyo, Japan",
  "days": 5,
  "budget": 3000,
  "travel_style": "cultural"
}
```

**Travel Styles**: `adventure`, `relaxation`, `cultural`, `luxury`, `budget`, `family`

**Response:**
```json
{
  "destination": "Tokyo, Japan",
  "total_days": 5,
  "total_budget": 3000,
  "travel_style": "cultural",
  "days": [
    {
      "day": 1,
      "title": "Historic Tokyo",
      "morning": [
        {
          "name": "Senso-ji Temple",
          "description": "Ancient Buddhist temple in Asakusa",
          "duration": "2 hours",
          "estimated_cost": 0
        }
      ],
      "afternoon": [...],
      "evening": [...],
      "accommodation": "Hotel in Shinjuku area",
      "daily_budget": 600
    }
  ],
  "transport": [
    {
      "type": "JR Pass",
      "details": "7-day unlimited train pass",
      "estimated_cost": 300
    }
  ],
  "tips": ["Buy JR Pass before arrival", "Learn basic Japanese phrases"]
}
```

### Ingest Document (Admin)
```http
POST /ingest
Content-Type: application/json

{
  "text": "London is the capital of England...",
  "metadata": {
    "type": "city_guide",
    "destination": "London",
    "category": "overview"
  }
}
```

## 🧪 Testing

### Using cURL

```bash
# Health check
curl http://localhost:8000/health

# Plan trip
curl -X POST http://localhost:8000/plan \
  -H "Content-Type: application/json" \
  -d '{
    "destination": "Paris, France",
    "days": 3,
    "budget": 2000,
    "travel_style": "cultural"
  }'
```

### Using Swagger UI

Visit `http://localhost:8000/docs` for interactive API documentation.

## 🔧 Configuration Options

Edit `.env` to customize:

```env
# RAG Settings
CHUNK_SIZE=1000              # Text chunk size
CHUNK_OVERLAP=200            # Overlap between chunks
TOP_K_RESULTS=5              # Number of documents to retrieve

# Model Settings
EMBEDDING_MODEL=models/text-embedding-004
GENERATION_MODEL=gemini-1.5-flash
```

## 📊 RAG Pipeline

1. **Query Processing**: User request converted to embedding
2. **Vector Search**: MongoDB Atlas finds top-K similar documents
3. **Context Building**: Retrieved documents formatted as context
4. **Generation**: Gemini generates structured itinerary using only retrieved context
5. **Validation**: Pydantic validates response structure

## 🛡️ Production Considerations

- **CORS**: Update `allow_origins` in `app/main.py` for production domains
- **API Keys**: Use secret management (AWS Secrets Manager, Azure Key Vault, etc.)
- **Rate Limiting**: Add rate limiting middleware
- **Logging**: Implement structured logging
- **Monitoring**: Add application monitoring (e.g., Sentry)
- **Caching**: Cache frequent queries with Redis

## 📝 Sample Ingestion Script

Create `scripts/ingest_data.py`:

```python
from app.ingest import ingest_document

# Add more destinations
destinations = [
    {
        "text": "...",  # Your content
        "metadata": {
            "type": "city_guide",
            "destination": "Barcelona",
            "country": "Spain"
        }
    }
]

for doc in destinations:
    chunks = ingest_document(doc["text"], doc["metadata"])
    print(f"Ingested {chunks} chunks")
```

## 🐛 Troubleshooting

**Vector index not found:**
- Verify index name is exactly `vector_index`
- Check index build status in Atlas
- Ensure `numDimensions: 768` matches Gemini embeddings

**Connection errors:**
- Verify MongoDB URI is correct
- Check IP whitelist in Atlas (use `0.0.0.0/0` for testing)
- Ensure network connectivity

**LLM errors:**
- Verify Gemini API key is valid
- Check API quota limits
- Review prompt structure in `app/generate.py`

## 📄 License

MIT

## 👨‍💻 Author

Built for production-ready, resume-worthy backend development.
