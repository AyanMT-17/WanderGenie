"""
Script to ingest sample data into MongoDB
Run this after setting up the database and vector index
"""
import sys
sys.path.append('.')

from app.ingest import ingest_sample_data

if __name__ == "__main__":
    print("🚀 Starting sample data ingestion...\n")
    
    try:
        total_chunks = ingest_sample_data()
        print(f"\n✅ Successfully ingested sample data!")
        print(f"📊 Total chunks created: {total_chunks}")
        print("\n💡 You can now test the /plan endpoint with destinations:")
        print("   - Tokyo, Japan")
        print("   - Paris, France")
        print("   - New York City, USA")
        
    except Exception as e:
        print(f"\n❌ Error during ingestion: {e}")
        print("\n⚠️  Make sure:")
        print("   1. MongoDB is accessible")
        print("   2. .env file is configured correctly")
        print("   3. Gemini API key is valid")
        sys.exit(1)
