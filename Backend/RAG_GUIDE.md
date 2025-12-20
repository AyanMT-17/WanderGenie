# RAG Database Management Guide

## 🎯 How to Add RAG Data for Any Destination

You have **three methods** to populate your RAG database:

---

## Method 1: Single Destination (Quick)

### Add one destination at a time:

```bash
# Activate virtual environment
.\venv\Scripts\activate

# Generate guide for any destination
python scripts/generate_destination_guide.py "London, England"
python scripts/generate_destination_guide.py "Dubai, UAE"
python scripts/generate_destination_guide.py "Sydney, Australia"
```

### Add multiple at once:
```bash
python scripts/generate_destination_guide.py "London, England" "Dubai, UAE" "Bali, Indonesia"
```

---

## Method 2: Batch Import Popular Destinations

### Automatically add 30+ popular destinations:

```bash
.\venv\Scripts\activate
python scripts/populate_popular_destinations.py
```

This includes:
- **Asia**: Bangkok, Singapore, Dubai, Seoul, Mumbai, Hong Kong, Bali
- **Europe**: London, Rome, Barcelona, Amsterdam, Prague, Vienna, Berlin, Istanbul  
- **Americas**: Los Angeles, Las Vegas, Miami, Mexico City, Rio, Buenos Aires
- **Others**: Sydney, Melbourne, Auckland, Cape Town, Marrakech

⏱️ **Takes ~60 minutes** to complete all destinations

---

## Method 3: Manual Curation (Best Quality)

### For the highest quality, manually curate content:

1. **Create travel guide content** (copy from travel blogs, guides, etc.)

2. **Use the API endpoint** at `POST /ingest`:

```bash
curl -X POST http://localhost:8000/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Your detailed travel guide text here...",
    "metadata": {
      "type": "city_guide",
      "destination": "Kyoto",
      "country": "Japan",
      "category": "overview"
    }
  }'
```

3. **Or add to** `scripts/ingest_sample_data.py` and run it

---

## 🔍 How It Works

### AI-Generated Process:
1. **Groq AI generates** a comprehensive travel guide
2. **Text is chunked** into searchable segments  
3. **Embeddings are created** using Google Gemini
4. **Stored in MongoDB** with vector search capability
5. **Retrieved during planning** via semantic search

### What Gets Generated:
- ✅ Must-visit attractions with prices
- ✅ Transportation options and costs
- ✅ Accommodation recommendations (budget/mid/luxury)
- ✅ Food scene and typical costs
- ✅ Practical travel tips
- ✅ Hidden gems

---

## 📊 Check Your Database

### See what destinations you have:

```bash
# In MongoDB Atlas or via Python:
from app.db import get_collection
collection = get_collection()

# Get unique destinations
destinations = collection.distinct("metadata.destination")
print(f"Total destinations: {len(destinations)}")
print(destinations)
```

---

## 🎯 Best Practices

### Start Small:
1. Add 5-10 destinations you care about most
2. Test the quality of generated itineraries
3. Gradually expand to more cities

### Quality Check:
- Review AI-generated guides before production use
- Update with current pricing periodically  
- Add your own insights and hidden gems

### Continuous Improvement:
- User feedback → Update guides
- New attractions opened → Add them
- Prices changed → Refresh data

---

## ⚡ Quick Start (Recommended)

```bash
# 1. Add a few key destinations to start
.\venv\Scripts\activate
python scripts/generate_destination_guide.py "London, England" "Dubai, UAE" "Bali, Indonesia"

# 2. Test an itinerary for these cities
# Go to your app and create a trip!

# 3. Later, expand with batch import
python scripts/populate_popular_destinations.py
```

---

## 🆚 RAG vs Pure AI

| Aspect | With RAG (Database) | Without RAG (Pure AI) |
|--------|-------------------|---------------------|
| **Accuracy** | High (verified data) | Medium (may hallucinate) |
| **Freshness** | Current (you control) | Training cutoff date |
| **Customization** | Your unique insights | Generic for everyone |
| **Speed** | Fast (cached embeddings) | Same |
| **Cost** | Slightly higher (embeddings) | Lower |
| **Best For** | Popular destinations | Long-tail destinations |

---

## 💡 Pro Tips

1. **Hybrid Approach**: Add RAG for top 20-30 destinations, let AI handle the rest
2. **User Contributions**: Let users submit tips → Add to RAG
3. **Partner Data**: Add hotel deals, tour packages → Differentiate from competitors
4. **Seasonal Updates**: Refresh data quarterly with current prices
5. **Analytics**: Track which destinations are searched → Prioritize for RAG

---

## 🚀 Ready to Start?

```bash
# Quick test - Add London
python scripts/generate_destination_guide.py "London, England"

# Create a London trip in your app
# See the difference! 🎉
```
