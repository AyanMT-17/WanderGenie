"""
Batch script to populate RAG database with popular travel destinations.
Run this to add comprehensive guides for the world's most popular cities.
"""
import sys
sys.path.append('.')

import subprocess

# Top 30 most popular tourist destinations
POPULAR_DESTINATIONS = [
    # Asia
    "Bangkok, Thailand",
    "Singapore, Singapore", 
    "Dubai, UAE",
    "Seoul, South Korea",
    "Mumbai, India",
    "Hong Kong, China",
    "Bali, Indonesia",
    
    # Europe
    "London, England",
    "Rome, Italy",
    "Barcelona, Spain",
    "Amsterdam, Netherlands",
    "Prague, Czech Republic",
    "Vienna, Austria",
    "Berlin, Germany",
    "Istanbul, Turkey",
    
    # Americas
    "Los Angeles, USA",
    "Las Vegas, USA",
    "Miami, USA",
    "Mexico City, Mexico",
    "Rio de Janeiro, Brazil",
    "Buenos Aires, Argentina",
    
    # Oceania & Africa
    "Sydney, Australia",
    "Melbourne, Australia",
    "Auckland, New Zealand",
    "Cape Town, South Africa",
    "Marrakech, Morocco",
]


def main():
    print("🌍 WanderGenie - Bulk Destination Guide Generator")
    print("=" * 60)
    print(f"\nThis will generate RAG data for {len(POPULAR_DESTINATIONS)} popular destinations.")
    print("⏱️  Estimated time: ~{} minutes\n".format(len(POPULAR_DESTINATIONS) * 2))
    
    choice = input("Continue? (y/n): ").strip().lower()
    
    if choice != 'y':
        print("❌ Cancelled.")
        return
    
    print("\n🚀 Starting batch generation...\n")
    
    success_count = 0
    failed = []
    
    for i, destination in enumerate(POPULAR_DESTINATIONS, 1):
        print(f"\n[{i}/{len(POPULAR_DESTINATIONS)}] Processing: {destination}")
        print("-" * 60)
        
        try:
            result = subprocess.run(
                [sys.executable, "scripts/generate_destination_guide.py", destination],
                capture_output=True,
                text=True,
                timeout=120  # 2 minute timeout per destination
            )
            
            if result.returncode == 0:
                success_count += 1
                print(f"✅ Success: {destination}")
            else:
                failed.append(destination)
                print(f"❌ Failed: {destination}")
                print(f"Error: {result.stderr[:200]}")
                
        except subprocess.TimeoutExpired:
            failed.append(destination)
            print(f"⏰ Timeout: {destination}")
        except Exception as e:
            failed.append(destination)
            print(f"❌ Error: {destination} - {e}")
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 SUMMARY")
    print("=" * 60)
    print(f"✅ Successfully processed: {success_count}/{len(POPULAR_DESTINATIONS)}")
    
    if failed:
        print(f"\n❌ Failed destinations ({len(failed)}):")
        for dest in failed:
            print(f"   - {dest}")
    
    print("\n🎉 Batch generation complete!")
    print("💡 Your RAG database is now populated with comprehensive travel guides!")


if __name__ == "__main__":
    main()
