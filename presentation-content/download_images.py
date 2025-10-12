import json
import os
import requests
from urllib.parse import urlparse
from pathlib import Path

def download_image(url, output_dir):
    """Download an image from URL and save it locally."""
    try:
        # Headers to avoid 403 errors
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        # Parse the URL to get filename
        parsed = urlparse(url)
        filename = os.path.basename(parsed.path)
        
        # Clean up filename (remove URL encoding)
        from urllib.parse import unquote
        filename = unquote(filename)
        
        # If no filename, generate one from the URL
        if not filename or '.' not in filename:
            # Use a hash of the URL as filename
            import hashlib
            hash_name = hashlib.md5(url.encode()).hexdigest()
            # Try to get extension from content-type
            response = requests.head(url, headers=headers, timeout=10)
            content_type = response.headers.get('content-type', '')
            ext = '.jpg'  # default
            if 'png' in content_type:
                ext = '.png'
            elif 'jpeg' in content_type or 'jpg' in content_type:
                ext = '.jpg'
            elif 'svg' in content_type:
                ext = '.svg'
            elif 'webp' in content_type:
                ext = '.webp'
            filename = f"{hash_name}{ext}"
        
        output_path = os.path.join(output_dir, filename)
        
        # Skip if already exists
        if os.path.exists(output_path):
            print(f"✓ Already exists: {filename}")
            return filename
        
        # Download the image
        print(f"⬇ Downloading: {url}")
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()
        
        # Save to file
        with open(output_path, 'wb') as f:
            f.write(response.content)
        
        print(f"✓ Saved: {filename}")
        return filename
        
    except Exception as e:
        print(f"✗ Error downloading {url}: {e}")
        return None

def main():
    # Load the JSON file
    json_path = Path(__file__).parent / 'content-en.json'
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Create output directory
    output_dir = Path(__file__).parent / 'downloaded_images'
    output_dir.mkdir(exist_ok=True)
    
    # Track URLs and their local paths
    url_mapping = {}
    
    # Extract all image URLs from the JSON
    for segment in data.get('segments', []):
        media_list = segment.get('media', [])
        for media in media_list:
            if media.get('type') == 'image':
                src = media.get('src', '')
                # Only download external URLs (http/https)
                if src.startswith('http://') or src.startswith('https://'):
                    print(f"\n📷 Processing: {src}")
                    local_filename = download_image(src, str(output_dir))
                    if local_filename:
                        url_mapping[src] = f"downloaded_images/{local_filename}"
    
    # Save the mapping to a file for reference
    mapping_path = Path(__file__).parent / 'image_url_mapping.json'
    with open(mapping_path, 'w', encoding='utf-8') as f:
        json.dump(url_mapping, f, indent=2)
    
    print(f"\n✅ Done! Downloaded {len(url_mapping)} images")
    print(f"📄 URL mapping saved to: {mapping_path}")
    print(f"\n💡 To use local images, update the 'src' fields in content-en.json")
    print(f"   from the URLs to the local paths in image_url_mapping.json")

if __name__ == '__main__':
    main()
