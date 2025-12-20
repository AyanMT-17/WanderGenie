"""
Configuration management using pydantic-settings
"""
import os
from pydantic_settings import BaseSettings
from functools import lru_cache
from google import genai


class Settings(BaseSettings):
    """Application settings"""
    
    # API Configuration
    app_name: str = "WanderGenie API"
    debug: bool = False
    
    # MongoDB Settings
    mongodb_uri: str
    db_name: str = "wandergenie"
    collection_name: str = "travel_documents"
    
    # Google Gemini Settings (for embeddings)
    gemini_api_key: str
    embedding_model: str = "models/text-embedding-004"
    
    # Groq Settings (for content generation)
    groq_api_key: str
    generation_model: str = "llama-3.3-70b-versatile"  # Fast and capable model
    
    # RAG Settings
    chunk_size: int = 1000
    chunk_overlap: int = 200
    top_k_results: int = 5
    
    # Authentication Settings
    jwt_secret_key: str = "your-secret-key-change-in-production"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24 * 7  # 7 days
    
    class Config:
        env_file = ".env"
        case_sensitive = False


def get_settings() -> Settings:
    """Get settings instance"""
    settings = Settings()
    
    # No need to configure API key globally with new SDK
    # API key will be passed when creating the client
    
    return settings

