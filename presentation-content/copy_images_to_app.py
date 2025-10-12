import shutil
from pathlib import Path

def main():
    # Source directory
    source_dir = Path(__file__).parent / 'downloaded_images'
    
    # Destination directory
    dest_dir = Path(__file__).parent.parent / 'slide-app' / 'public' / 'assets' / 'downloaded_images'
    
    # Create destination directory if it doesn't exist
    dest_dir.mkdir(parents=True, exist_ok=True)
    
    # Copy all images
    if source_dir.exists():
        copied = 0
        for image_file in source_dir.glob('*'):
            if image_file.is_file():
                dest_file = dest_dir / image_file.name
                shutil.copy2(image_file, dest_file)
                print(f"✓ Copied: {image_file.name}")
                copied += 1
        
        print(f"\n✅ Copied {copied} images to {dest_dir}")
    else:
        print(f"⚠ Source directory not found: {source_dir}")

if __name__ == '__main__':
    main()
