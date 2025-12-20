# 🌍 WanderGenie - AI-Powered Travel Planner

![WanderGenie Banner](https://img.shields.io/badge/AI-Powered-brightgreen) ![React](https://img.shields.io/badge/React-18.x-blue) ![FastAPI](https://img.shields.io/badge/FastAPI-Latest-009688) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)

**WanderGenie** is an intelligent travel planning application that uses AI and RAG (Retrieval-Augmented Generation) to create personalized travel itineraries for any destination worldwide. Get detailed day-by-day plans with real attractions, accurate pricing, and practical travel tips - all generated in seconds!

---

## ✨ Features

### 🤖 **AI-Powered Itinerary Generation**
- Create detailed travel plans for **any destination worldwide**
- Day-by-day schedules with morning, afternoon, and evening activities
- Budget breakdowns with realistic cost estimates
- Accommodation and transportation recommendations

### 🧠 **Smart RAG System**
- **Automatic knowledge base generation** for new destinations
- Vector-based semantic search for accurate information retrieval
- Self-improving database that grows with usage
- Combines AI intelligence with verified travel data

### 🔒 **Secure Authentication**
- JWT-based user authentication
- Protected routes and personalized experiences
- User-specific itinerary history

### 📱 **Modern UI/UX**
- Beautiful, responsive design with Tailwind CSS
- Dark/Light mode support
- Smooth animations and transitions
- Interactive itinerary cards

### 💾 **Itinerary Management**
- Save and revisit past travel plans
- View detailed trip breakdowns
- Quick access to previous adventures

---

## 🏗️ Tech Stack

### **Frontend**
- ⚛️ **React 18** with TypeScript
- 🎨 **Tailwind CSS** for styling
- 🧩 **Shadcn UI** components
- 🚀 **Vite** for blazing-fast development
- 📡 **Axios** for API communication
- 🔄 **React Router** for navigation

### **Backend**
- 🐍 **FastAPI** (Python)
- 🗄️ **MongoDB Atlas** with vector search
- 🤖 **Groq AI** (Llama 3.3 70B) for content generation
- 🧠 **Google Gemini** for text embeddings
- 🔐 **JWT** authentication
- 📝 **Pydantic** for data validation

### **AI & RAG**
- **Groq API** - Fast LLM inference
- **Google Gemini Embeddings** - Text-to-vector conversion
- **MongoDB Vector Search** - Semantic similarity matching
- **Automatic Guide Generation** - Creates travel guides on-demand

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.9+
- **MongoDB Atlas** account (free tier works)
- **API Keys**:
  - [Groq API Key](https://console.groq.com)
  - [Google Gemini API Key](https://makersuite.google.com/app/apikey)

---

### 📥 Installation

#### 1️⃣ **Clone the Repository**

```bash
git clone https://github.com/yourusername/wandergenie.git
cd wandergenie
```

#### 2️⃣ **Backend Setup**

```bash
cd WanderGenie/Backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env  # Then edit with your credentials
```

**Backend `.env` Configuration:**

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
DB_NAME=wandergenie
COLLECTION_NAME=travel_documents

# API Keys
GEMINI_API_KEY=your_gemini_api_key_here
GROQ_API_KEY=your_groq_api_key_here

# JWT Secret
JWT_SECRET_KEY=your-super-secret-jwt-key-change-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080
```

**Set up MongoDB Vector Index:**

1. Go to MongoDB Atlas → Browse Collections
2. Create index on `travel_documents` collection:

```javascript
{
  "type": "vectorSearch",
  "fields": [{
    "type": "vector",
    "path": "embedding",
    "numDimensions": 768,
    "similarity": "cosine"
  }]
}
```
Name it: `vector_index`

**Populate Sample Data:**

```bash
python scripts/ingest_sample_data.py
```

**Start Backend Server:**

```bash
uvicorn app.main:app --reload
```

Backend will run on **http://localhost:8000**

---

#### 3️⃣ **Frontend Setup**

```bash
cd ../Frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env  # Then edit if needed
```

**Frontend `.env` (Optional):**

```env
VITE_API_URL=http://localhost:8000
```

**Start Frontend:**

```bash
npm run dev
```

Frontend will run on **http://localhost:5173**

---

## 📖 Usage

### **Creating Your First Trip**

1. **Sign Up / Login**
   - Visit http://localhost:5173
   - Create an account or log in

2. **Plan a Trip**
   - Click "Start Planning Now"
   - Enter destination (e.g., "Tokyo, Japan")
   - Set number of days (1-30)
   - Choose budget
   - Select travel style

3. **Get Your Itinerary**
   - AI generates a detailed day-by-day plan
   - View attractions with costs
   - See accommodation recommendations
   - Check transportation options
   - Read practical travel tips

4. **View Past Trips**
   - Click on any previous itinerary from homepage
   - Revisit your travel plans anytime

---

## 🧠 How RAG Works

### **The Magic Behind WanderGenie**

```
User Request → Check Database → Auto-Generate if Needed → 
Vector Search → Retrieve Context → AI Generation → 
Accurate Itinerary
```

**Step-by-Step:**

1. **Check**: Does destination data exist in database?
2. **Auto-Generate**: If new, AI creates comprehensive travel guide (5-10 sec)
3. **Embed**: Convert text to 768-dimensional vectors
4. **Store**: Save in MongoDB with vector index
5. **Retrieve**: Semantic search finds relevant information
6. **Augment**: Combine retrieved context with user request
7. **Generate**: AI creates personalized itinerary using real data

**Benefits:**
- ✅ Accurate, verified information
- ✅ Current pricing and details
- ✅ Works for ANY destination
- ✅ Self-improving knowledge base
- ✅ Fast subsequent requests (cached)

See [AUTO_RAG_SYSTEM.md](Backend/AUTO_RAG_SYSTEM.md) for detailed explanation.

---

## 📁 Project Structure

```
WanderGenie/
├── Backend/
│   ├── app/
│   │   ├── main.py              # FastAPI application
│   │   ├── config.py            # Configuration & settings
│   │   ├── auth.py              # Authentication logic
│   │   ├── generate.py          # Itinerary generation + RAG
│   │   ├── retrieve.py          # Vector search
│   │   ├── embeddings.py        # Text embedding
│   │   ├── ingest.py            # Document ingestion
│   │   ├── db.py                # MongoDB connection
│   │   └── schemas.py           # Pydantic models
│   ├── scripts/
│   │   ├── ingest_sample_data.py         # Pre-load destinations
│   │   └── generate_destination_guide.py # Generate any city
│   ├── requirements.txt
│   └── .env
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── home/            # Hero, Features
│   │   │   ├── layout/          # Header
│   │   │   ├── planner/         # Trip planner components
│   │   │   └── ui/              # Shadcn UI components
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx  # Auth state management
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── CreateTrip.tsx
│   │   │   ├── ItineraryResult.tsx
│   │   │   ├── Login.tsx
│   │   │   └── Signup.tsx
│   │   ├── lib/
│   │   │   └── api.ts           # API client
│   │   └── App.tsx
│   ├── package.json
│   └── .env
│
└── README.md                     # This file
```

---

## 🔌 API Endpoints

### **Authentication**
- `POST /auth/register` - Create new account
- `POST /auth/login` - Login with credentials
- `GET /auth/me` - Get current user info

### **Trip Planning**
- `POST /plan` - Generate travel itinerary (Protected)
- `GET /itineraries` - Get user's itinerary history (Protected)

### **Admin**
- `POST /ingest` - Manually add travel documents
- `GET /health` - Health check

### **Example Request:**

```bash
curl -X POST http://localhost:8000/plan \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "destination": "Paris, France",
    "days": 3,
    "budget": 1500,
    "travel_style": "cultural"
  }'
```

---

## 🎨 Environment Variables

### **Backend**

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | ✅ |
| `GEMINI_API_KEY` | Google Gemini API key | ✅ |
| `GROQ_API_KEY` | Groq API key | ✅ |
| `JWT_SECRET_KEY` | Secret for JWT tokens | ✅ |
| `DB_NAME` | Database name | ❌ (default: wandergenie) |

### **Frontend**

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API URL | ❌ (default: http://localhost:8000) |

---

## 🛠️ Development

### **Adding New Destinations**

**Manual (High Quality):**
```bash
# Edit scripts/ingest_sample_data.py
# Add your destination data
python scripts/ingest_sample_data.py
```

**Auto-Generate (Any City):**
```bash
python scripts/generate_destination_guide.py "London, England"
```

**Batch Import:**
```bash
python scripts/populate_popular_destinations.py
```

### **Run Tests**

```bash
# Backend
pytest

# Frontend
npm test
```

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Groq** for blazing-fast LLM inference
- **Google Gemini** for powerful embeddings
- **MongoDB** for vector search capabilities
- **Shadcn UI** for beautiful components
- **FastAPI** for the excellent Python framework

---

## 📧 Contact

**Your Name** - [@yourtwitter](https://twitter.com/yourtwitter)

Project Link: [https://github.com/yourusername/wandergenie](https://github.com/yourusername/wandergenie)

---

## 🌟 Show Your Support

Give a ⭐️ if this project helped you plan amazing trips!

---

**Happy Travels with WanderGenie! ✈️🌍**
