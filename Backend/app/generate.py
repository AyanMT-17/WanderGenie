"""
Itinerary generation using RAG with Groq
"""
from groq import Groq
import json
from typing import Dict, Any
from app.schemas import PlanRequest, Itinerary
from app.retrieve import retrieve_context
from app.config import get_settings
from app.db import get_collection
from app.ingest import ingest_document
import re


def auto_generate_destination_guide(destination: str) -> bool:
    """
    Automatically generate and ingest a travel guide for a destination.
    Called when no RAG data exists for a destination.
    
    Args:
        destination: Destination string (e.g., "London, England")
        
    Returns:
        True if successful, False otherwise
    """
    try:
        settings = get_settings()
        client = Groq(api_key=settings.groq_api_key)
        
        # Parse destination
        parts = [p.strip() for p in destination.split(',')]
        city = parts[0]
        country = parts[1] if len(parts) > 1 else "Unknown"
        
        print(f"🤖 Auto-generating RAG data for {city}, {country}...")
        
        # Generate comprehensive guide
        prompt = f"""Create a comprehensive, detailed travel guide for {city}, {country}.

Include:

1. **Overview**: Brief introduction (2-3 sentences)

2. **Must-Visit Attractions** (8-10 with specific details):
   - Name, description, entry cost (local + USD), notable features

3. **Transportation**:
   - Airport transfers, public transit, costs, tourist passes

4. **Accommodation** (USD per night):
   - Budget, mid-range, luxury options with areas

5. **Food & Dining** (typical USD costs):
   - Street food, mid-range, fine dining, must-try dishes

6. **Travel Tips** (5-7 practical tips):
   - Best time, customs, safety, money-saving, language

7. **Hidden Gems** (2-3 lesser-known spots)

Be specific with prices and practical details. Use current 2024-2025 information.
Format as plain text with clear sections."""
        
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": "You are a professional travel guide writer. Provide accurate, specific, practical information with realistic pricing."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.7,
            max_tokens=2048
        )
        
        guide_text = response.choices[0].message.content
        
        # Ingest into database
        chunks = ingest_document(
            text=guide_text,
            metadata={
                "type": "city_guide",
                "destination": city,
                "country": country,
                "category": "overview",
                "generated_by": "auto",
                "source": "groq_llama"
            }
        )
        
        print(f"✅ Auto-generated {chunks} chunks for {city}, {country}")
        return True
        
    except Exception as e:
        print(f"⚠️  Auto-generation failed for {destination}: {e}")
        return False


def check_destination_exists(destination: str) -> bool:
    """
    Check if RAG data exists for a destination.
    
    Args:
        destination: Destination string
        
    Returns:
        True if data exists, False otherwise
    """
    try:
        collection = get_collection()
        
        # Extract city name (first part before comma)
        city = destination.split(',')[0].strip()
        
        # Case-insensitive search
        count = collection.count_documents({
            "metadata.destination": {"$regex": f"^{re.escape(city)}$", "$options": "i"}
        })
        
        return count > 0
        
    except Exception as e:
        print(f"⚠️  Error checking destination: {e}")
        return False


def build_prompt(request: PlanRequest, context: str) -> str:
    """
    Build a prompt for itinerary generation.
    
    Args:
        request: User's travel planning request
        context: Retrieved context from vector search
        
    Returns:
        Formatted prompt string
    """
    has_context = context and "No specific information available" not in context
    
    if has_context:
        context_instruction = f"""**Retrieved Information (PRIORITIZE THIS):**
{context}

**Instructions:**
1. PRIORITIZE information from the retrieved context above
2. Use specific attractions, prices, and details from the context
3. Supplement with your general knowledge only when context is insufficient"""
    else:
        context_instruction = f"""**Note:** No specific database information available for {request.destination}.

**Instructions:**
1. Use your extensive knowledge about {request.destination} to create an authentic itinerary
2. Provide realistic attraction names, descriptions, and estimated costs
3. Ensure all recommendations are genuine and practical"""
    
    prompt = f"""You are an expert travel planner. Create a detailed, personalized day-by-day travel itinerary.

**User Request:**
- Destination: {request.destination}
- Duration: {request.days} days
- Budget: ${request.budget} USD total
- Travel Style: {request.travel_style}

{context_instruction}

**Required JSON Structure:**
{{
  "destination": "{request.destination}",
  "total_days": {request.days},
  "total_budget": {request.budget},
  "travel_style": "{request.travel_style.value}",
  "days": [
    {{
      "day": 1,
      "title": "Day title/theme (e.g., 'Exploring Historic Downtown')",
      "morning": [
        {{
          "name": "Attraction name",
          "description": "Brief engaging description",
          "duration": "Estimated time (e.g., '2 hours')",
          "estimated_cost": 25.0
        }}
      ],
      "afternoon": [...],
      "evening": [...],
      "accommodation": "Hotel/area suggestion matching budget level",
      "daily_budget": 200.0
    }}
  ],
  "transport": [
    {{
      "type": "Transportation type (e.g., 'Metro', 'Taxi', 'Airport Transfer')",
      "details": "Specific details and routes",
      "estimated_cost": 100.0
    }}
  ],
  "tips": ["Practical travel tip 1", "Local insight 2", "Safety/cultural tip 3"]
}}

**Planning Guidelines:**
1. Distribute activities logically across {request.days} days
2. Morning (9am-12pm): 2-3 major attractions
3. Afternoon (1pm-5pm): 2-3 activities/attractions
4. Evening (6pm-10pm): 1-2 dining/entertainment activities
5. Ensure daily budgets sum to approximately ${request.budget}
6. Match accommodation and activities to "{request.travel_style}" style
7. Include 3-5 practical, specific travel tips
8. All costs should be realistic estimates in USD

Return ONLY valid JSON, no markdown formatting or additional text.
"""
    return prompt


def parse_itinerary_response(response_text: str, request: PlanRequest) -> Dict[str, Any]:
    """
    Parse and validate LLM response into structured itinerary.
    
    Args:
        response_text: Raw LLM response
        request: Original request for fallback values
        
    Returns:
        Validated itinerary dictionary
    """
    try:
        # Try to extract JSON from response
        start_idx = response_text.find('{')
        end_idx = response_text.rfind('}') + 1
        
        if start_idx != -1 and end_idx > start_idx:
            json_str = response_text[start_idx:end_idx]
            itinerary_data = json.loads(json_str)
            return itinerary_data
        else:
            raise ValueError("No JSON found in response")
            
    except (json.JSONDecodeError, ValueError) as e:
        # Fallback: Return minimal valid structure
        print(f"⚠️  Failed to parse LLM response: {e}")
        return {
            "destination": request.destination,
            "total_days": request.days,
            "total_budget": request.budget,
            "travel_style": request.travel_style.value,
            "days": [
                {
                    "day": i + 1,
                    "title": f"Day {i + 1} in {request.destination}",
                    "morning": [{
                        "name": "Explore local area",
                        "description": "Information not available in context",
                        "duration": "3 hours",
                        "estimated_cost": 0.0
                    }],
                    "afternoon": [{
                        "name": "Continue exploring",
                        "description": "Information not available in context",
                        "duration": "3 hours",
                        "estimated_cost": 0.0
                    }],
                    "evening": [{
                        "name": "Dinner and relaxation",
                        "description": "Information not available in context",
                        "duration": "2 hours",
                        "estimated_cost": request.budget / request.days * 0.3
                    }],
                    "accommodation": "Budget-appropriate accommodation",
                    "daily_budget": request.budget / request.days
                }
                for i in range(request.days)
            ],
            "transport": [{
                "type": "Local transport",
                "details": "Information not available in context",
                "estimated_cost": request.budget * 0.1
            }],
            "tips": ["Plan ahead", "Check weather", "Book accommodations early"]
        }


def generate_itinerary(request: PlanRequest) -> Itinerary:
    """
    Main RAG pipeline: retrieve context and generate itinerary.
    Auto-generates RAG data for new destinations on first request.
    
    Args:
        request: Travel planning request
        
    Returns:
        Structured itinerary
    """
    settings = get_settings()
    
    # Step 0: Check if destination exists in RAG, auto-generate if not
    if not check_destination_exists(request.destination):
        print(f"📍 New destination detected: {request.destination}")
        auto_generate_destination_guide(request.destination)
        # Small delay to ensure data is indexed
        import time
        time.sleep(1)
    
    # Step 1: Retrieve relevant context
    query = f"{request.destination} {request.travel_style.value} travel guide attractions hotels transport budget"
    context_docs = retrieve_context(query, top_k=settings.top_k_results)
    
    if not context_docs:
        context = "No specific information available for this destination."
    else:
        context = "\n\n---\n\n".join(context_docs)
    
    # Step 2: Build prompt
    prompt = build_prompt(request, context)
    
    # Step 3: Generate with Groq
    client = Groq(api_key=settings.groq_api_key)
    
    response = client.chat.completions.create(
        model=settings.generation_model,
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.7,
        max_tokens=4096,
        top_p=0.95
    )
    
    # Step 4: Parse response
    response_text = response.choices[0].message.content
    itinerary_data = parse_itinerary_response(response_text, request)
    
    # Step 5: Validate with Pydantic
    itinerary = Itinerary(**itinerary_data)
    
    return itinerary
