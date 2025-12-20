"""
Script to automatically generate and ingest travel guides for any destination
using AI, then store them in the RAG database.

Usage:
    python scripts/generate_destination_guide.py "London, England"
    python scripts/generate_destination_guide.py "Dubai, UAE" "Bali, Indonesia"
"""
import sys
sys.path.append('.')

from groq import Groq
from app.config import get_settings
from app.ingest import ingest_document


def generate_travel_guide(destination: str, country: str) -> str:
    """
    Use Groq AI to generate a comprehensive travel guide for a destination.
    
    Args:
        destination: City name
        country: Country name
        
    Returns:
        Detailed travel guide text
    """
    settings = get_settings()
    client = Groq(api_key=settings.groq_api_key)
    
    prompt = f"""Create a comprehensive, detailed travel guide for {destination}, {country}.

Include the following sections with SPECIFIC, ACCURATE information:

1. **Overview**: Brief introduction (2-3 sentences)

2. **Must-Visit Attractions** (List 8-10 major attractions with):
   - Attraction name
   - Brief description (1-2 sentences)
   - Entry cost in local currency AND USD equivalent
   - Notable features

3. **Transportation**:
   - Airport transfers (cost and options)
   - Public transit options (metro, bus, etc.) with day pass costs
   - Taxi/ride-share typical costs
   - Tourist passes (if available)

4. **Accommodation** (Typical nightly rates in USD):
   - Budget hostels/hotels
   - Mid-range hotels
   - Luxury hotels
   - Recommended areas to stay

5. **Food & Dining** (Typical costs in USD):
   - Street food/casual dining
   - Mid-range restaurants
   - Fine dining
   - Must-try local dishes

6. **Travel Tips** (5-7 practical tips):
   - Best time to visit
   - Local customs/etiquette
   - Safety tips
   - Money-saving advice
   - Language considerations

7. **Hidden Gems** (2-3 lesser-known attractions)

Format as plain text with clear sections. Be specific with prices and practical details.
Ensure all information is realistic and current (2024-2025).
"""
    
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": "You are a professional travel guide writer with extensive knowledge of destinations worldwide. Provide accurate, practical information with specific details and realistic pricing."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.7,
        max_tokens=2048
    )
    
    return response.choices[0].message.content


def parse_destination(destination_str: str):
    """Parse 'City, Country' string into components."""
    parts = [p.strip() for p in destination_str.split(',')]
    if len(parts) >= 2:
        return parts[0], parts[1]
    return parts[0], "Unknown"


def main():
    if len(sys.argv) < 2:
        print("❌ Error: Please provide at least one destination")
        print("\nUsage:")
        print('  python scripts/generate_destination_guide.py "London, England"')
        print('  python scripts/generate_destination_guide.py "Dubai, UAE" "Bali, Indonesia"')
        sys.exit(1)
    
    destinations = sys.argv[1:]
    print(f"🌍 Generating travel guides for {len(destinations)} destination(s)...\n")
    
    total_chunks = 0
    
    for dest_str in destinations:
        try:
            city, country = parse_destination(dest_str)
            
            print(f"📝 Generating guide for {city}, {country}...")
            guide_text = generate_travel_guide(city, country)
            
            print(f"💾 Ingesting into database...")
            chunks = ingest_document(
                text=guide_text,
                metadata={
                    "type": "city_guide",
                    "destination": city,
                    "country": country,
                    "category": "overview",
                    "generated_by": "ai",
                    "source": "groq_llama"
                }
            )
            
            total_chunks += chunks
            print(f"✅ Successfully ingested {chunks} chunks for {city}, {country}\n")
            
        except Exception as e:
            print(f"❌ Error processing {dest_str}: {e}\n")
            continue
    
    print(f"\n{'='*60}")
    print(f"🎉 Completed! Total chunks ingested: {total_chunks}")
    print(f"{'='*60}")
    print("\n💡 You can now create itineraries for these destinations:")
    for dest in destinations:
        print(f"   - {dest}")
    print("\n🔍 The AI will now use this curated data from your RAG database!")


if __name__ == "__main__":
    main()
