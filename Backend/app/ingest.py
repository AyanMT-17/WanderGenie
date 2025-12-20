"""
Document ingestion pipeline
"""
from typing import List, Dict
from app.db import get_collection
from app.embeddings import get_embedding
from app.config import get_settings


def chunk_text(text: str, chunk_size: int = None, overlap: int = None) -> List[str]:
    """
    Split text into overlapping chunks.
    
    Args:
        text: Input text to chunk
        chunk_size: Size of each chunk (default from settings)
        overlap: Overlap between chunks (default from settings)
        
    Returns:
        List of text chunks
    """
    settings = get_settings()
    chunk_size = chunk_size or settings.chunk_size
    overlap = overlap or settings.chunk_overlap
    
    if len(text) <= chunk_size:
        return [text]
    
    chunks = []
    start = 0
    
    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]
        
        # Try to break at sentence boundary
        if end < len(text):
            last_period = chunk.rfind('.')
            last_newline = chunk.rfind('\n')
            break_point = max(last_period, last_newline)
            
            if break_point > chunk_size // 2:  # Only break if we're past halfway
                chunk = text[start:start + break_point + 1]
                end = start + break_point + 1
        
        chunks.append(chunk.strip())
        start = end - overlap
    
    return chunks


def ingest_document(text: str, metadata: Dict) -> int:
    """
    Ingest a document: chunk, embed, and store in MongoDB.
    
    Args:
        text: Document text
        metadata: Document metadata (type, destination, category, etc.)
        
    Returns:
        Number of chunks inserted
    """
    collection = get_collection()
    
    # Chunk the text
    chunks = chunk_text(text)
    
    # Process each chunk
    documents = []
    for i, chunk in enumerate(chunks):
        # Generate embedding
        embedding = get_embedding(chunk)
        
        # Create document
        doc = {
            "text": chunk,
            "embedding": embedding,
            "metadata": {
                **metadata,
                "chunk_index": i,
                "total_chunks": len(chunks)
            }
        }
        documents.append(doc)
    
    # Bulk insert
    if documents:
        collection.insert_many(documents)
    
    return len(documents)


def ingest_sample_data():
    """
    Ingest sample travel data for testing.
    This function can be called during setup to populate initial data.
    """
    sample_documents = [
        {
            "text": """
            Tokyo, Japan - A vibrant metropolis blending tradition and modernity.
            
            Must-Visit Attractions:
            - Senso-ji Temple: Ancient Buddhist temple in Asakusa, free entry
            - Tokyo Skytree: 634m tall tower with observation decks, ¥2,100-3,400
            - Shibuya Crossing: World's busiest pedestrian crossing, free
            - Meiji Shrine: Peaceful Shinto shrine in forest setting, free
            - Tsukiji Outer Market: Fresh seafood and street food, budget-friendly
            
            Transportation: JR Pass for tourists ¥29,650 for 7 days, covers most trains.
            Local subway day pass ¥600-900.
            
            Accommodation: Budget hostels ¥2,000-4,000/night, Mid-range hotels ¥8,000-15,000/night,
            Luxury hotels ¥20,000+/night.
            
            Food: Ramen ¥800-1,200, Sushi ¥2,000-10,000+, Convenience store meals ¥300-600.
            """,
            "metadata": {
                "type": "city_guide",
                "destination": "Tokyo",
                "country": "Japan",
                "category": "overview"
            }
        },
        {
            "text": """
            Paris, France - The City of Light, capital of romance and culture.
            
            Top Attractions:
            - Eiffel Tower: Iconic landmark, €28.30 for summit access
            - Louvre Museum: World's largest art museum, €17 entry
            - Arc de Triomphe: Napoleonic monument, €13 to climb
            - Notre-Dame: Gothic cathedral (exterior viewing currently), free
            - Champs-Élysées: Famous avenue for shopping and dining
            - Versailles Palace: Day trip from Paris, €20 entry
            
            Transportation: Metro/RER day pass €8-20, Paris Visite pass available.
            
            Accommodation: Budget hostels €30-60/night, Mid-range hotels €100-200/night,
            Luxury hotels €300+/night.
            
            Food: Croissant €1.50-3, Café lunch €12-20, Fine dining €50-150+.
            """,
            "metadata": {
                "type": "city_guide",
                "destination": "Paris",
                "country": "France",
                "category": "overview"
            }
        },
        {
            "text": """
            New York City, USA - The city that never sleeps.
            
            Major Attractions:
            - Statue of Liberty: Ferry and crown access $23.50
            - Empire State Building: Observation deck $44-79
            - Central Park: Urban oasis, free walking tours available
            - Metropolitan Museum: Suggested donation $30
            - Times Square: Bright lights and Broadway shows, free to visit
            - Brooklyn Bridge: Iconic bridge walk, free
            
            Transportation: MetroCard $2.90 per ride, weekly unlimited $34.
            
            Accommodation: Budget hostels $50-100/night, Mid-range hotels $150-300/night,
            Luxury hotels $400+/night.
            
            Food: Pizza slice $3-5, Diner meal $15-25, Fine dining $75-200+.
            """,
            "metadata": {
                "type": "city_guide",
                "destination": "New York City",
                "country": "USA",
                "category": "overview"
            }
        }
    ]
    
    total_chunks = 0
    for doc in sample_documents:
        chunks = ingest_document(doc["text"], doc["metadata"])
        total_chunks += chunks
        print(f"✓ Ingested {chunks} chunks for {doc['metadata']['destination']}")
    
    print(f"\n✅ Total chunks ingested: {total_chunks}")
    return total_chunks
