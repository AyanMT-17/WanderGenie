"""
Embedding generation using Google Gemini
"""
from google import genai
from google.genai import types
from typing import List
from app.config import get_settings


def get_embedding(text: str) -> List[float]:
    """
    Generate embedding vector for given text using Gemini.
    
    Args:
        text: Input text to embed
        
    Returns:
        768-dimensional embedding vector
    """
    settings = get_settings()
    client = genai.Client(api_key=settings.gemini_api_key)
    
    result = client.models.embed_content(
        model=settings.embedding_model,
        contents=text
    )
    
    return result.embeddings[0].values


def get_query_embedding(query: str) -> List[float]:
    """
    Generate embedding for search query.
    
    Args:
        query: Search query text
        
    Returns:
        768-dimensional embedding vector
    """
    settings = get_settings()
    client = genai.Client(api_key=settings.gemini_api_key)
    
    result = client.models.embed_content(
        model=settings.embedding_model,
        contents=query
    )
    
    return result.embeddings[0].values
