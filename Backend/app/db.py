"""
MongoDB connection and database utilities
"""
from pymongo import MongoClient
from pymongo.collection import Collection
from pymongo.database import Database
from functools import lru_cache
from app.config import get_settings


@lru_cache()
def get_mongo_client() -> MongoClient:
    """Get cached MongoDB client"""
    settings = get_settings()
    return MongoClient(settings.mongodb_uri)


def get_database() -> Database:
    """Get database instance"""
    settings = get_settings()
    client = get_mongo_client()
    return client[settings.db_name]


def get_collection() -> Collection:
    """Get travel documents collection"""
    settings = get_settings()
    db = get_database()
    return db[settings.collection_name]


def get_users_collection() -> Collection:
    """Get users collection"""
    db = get_database()
    return db["users"]



def ensure_vector_index():
    """
    Ensure vector search index exists on the collection.
    
    NOTE: This requires manual setup in MongoDB Atlas UI:
    1. Go to Atlas → Database → Browse Collections
    2. Select your database and collection
    3. Go to "Search Indexes" tab
    4. Create a "Vector Search" index with this configuration:
    
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
    
    Name it: vector_index
    """
    collection = get_collection()
    
    # List existing indexes
    indexes = list(collection.list_indexes())
    index_names = [idx['name'] for idx in indexes]
    
    if 'vector_index' not in index_names:
        print("⚠️  WARNING: Vector search index 'vector_index' not found!")
        print("Please create it manually in MongoDB Atlas. See docstring for instructions.")
    else:
        print("✓ Vector search index 'vector_index' found")
