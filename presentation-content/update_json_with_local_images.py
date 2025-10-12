import json
from pathlib import Path

def main():
    # Load the mapping
    mapping_path = Path(__file__).parent / 'image_url_mapping.json'
    with open(mapping_path, 'r', encoding='utf-8') as f:
        url_mapping = json.load(f)
    
    # Load the content JSON
    json_path = Path(__file__).parent / 'content-en.json'
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Track changes
    changes_made = 0
    
    # Update all image URLs in the JSON
    for segment in data.get('segments', []):
        media_list = segment.get('media', [])
        for media in media_list:
            if media.get('type') == 'image':
                src = media.get('src', '')
                # Check if we have a local version
                if src in url_mapping:
                    old_src = media['src']
                    # Update path to use assets/ prefix for the app
                    local_path = url_mapping[src]
                    media['src'] = f"assets/{local_path}"
                    print(f"✓ Updated: {old_src}")
                    print(f"  → {media['src']}")
                    changes_made += 1
    
    # Save the updated JSON
    if changes_made > 0:
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"\n✅ Updated {changes_made} image references in content-en.json")
    else:
        print("\n⚠ No changes made - all images already using local paths or not found in mapping")

if __name__ == '__main__':
    main()
