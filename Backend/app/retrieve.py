"""
Vector search retrieval using MongoDB Atlas Vector Search
"""
from typing import List, Dict
from app.db import get_collection
from app.embeddings import get_query_embedding
from app.config import get_settings


def retrieve_context(query: str, top_k: int = None, filter_metadata: Dict = None) -> List[str]:
    """
    Retrieve relevant documents using MongoDB Atlas Vector Search.
    
    Args:
        query: User query text
        top_k: Number of results to retrieve (default from settings)
        filter_metadata: Optional metadata filters (e.g., {"destination": "Tokyo"})
        
    Returns:
        List of relevant document texts
    """
    settings = get_settings()
    collection = get_collection()
    top_k = top_k or settings.top_k_results
    
    # Generate query embedding
    query_embedding = get_query_embedding(query)
    
    # Build vector search pipeline
    pipeline = [
        {
            "$vectorSearch": {
                "index": "vector_index",
                "path": "embedding",
                "queryVector": query_embedding,
                "numCandidates": top_k * 10,  # Oversample for better results
                "limit": top_k
            }
        },
        {
            "$project": {
                "text": 1,
                "metadata": 1,
                "score": {"$meta": "vectorSearchScore"}
            }
        }
    ]
    
    # Add metadata filter if provided
    if filter_metadata:
        pipeline.insert(1, {"$match": filter_metadata})
    
    # Execute search
    results = list(collection.aggregate(pipeline))
    
    # Extract text from results
    context_texts = [doc["text"] for doc in results]
    
    return context_texts


def retrieve_with_scores(query: str, top_k: int = None) -> List[Dict]:
    """
    Retrieve documents with similarity scores.
    
    Args:
        query: User query text
        top_k: Number of results to retrieve
        
    Returns:
        List of dicts with 'text', 'metadata', and 'score' keys
    """
    settings = get_settings()
    collection = get_collection()
    top_k = top_k or settings.top_k_results
    
    query_embedding = get_query_embedding(query)
    
    pipeline = [
        {
            "$vectorSearch": {
                "index": "vector_index",
                "path": "embedding",
                "queryVector": query_embedding,
                "numCandidates": top_k * 10,
                "limit": top_k
            }
        },
        {
            "$project": {
                "text": 1,
                "metadata": 1,
                "score": {"$meta": "vectorSearchScore"}
            }
        }
    ]
    
    results = list(collection.aggregate(pipeline))
    return results
