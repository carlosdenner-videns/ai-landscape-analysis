import csv
import os
import time
import re
import requests
from pathlib import Path
from urllib.parse import urlparse

# Configuration
CSV_FILE = "ai_watch_publications.csv"
PDF_FOLDER = "humaint_pdfs"
MAX_FILENAME_LENGTH = 80

def sanitize_filename(filename):
    """Remove or replace characters that are invalid in filenames."""
    # Replace invalid characters with underscore
    filename = re.sub(r'[<>:"/\\|?*]', '_', filename)
    # Replace multiple spaces/underscores with single underscore
    filename = re.sub(r'[_\s]+', '_', filename)
    # Remove leading/trailing underscores or dots
    filename = filename.strip('_. ')
    return filename

def extract_first_author(title_text):
    """Extract the first author's last name from the publication text."""
    # Try to find author pattern: "LastName, FirstInitial." at the start
    match = re.match(r'^([A-Za-zÀ-ÿ\-]+),?\s+[A-Z]\.?', title_text)
    if match:
        return match.group(1)
    
    # Try to find "et al" pattern
    match = re.match(r'^([A-Za-zÀ-ÿ\-]+)\s+et\s+al', title_text, re.IGNORECASE)
    if match:
        return match.group(1)
    
    return None

def extract_year(title_text):
    """Extract year from the title text."""
    # Look for 4-digit year (2018-2025)
    years = re.findall(r'\b(20[12]\d)\b', title_text)
    if years:
        return years[0]
    return None

def extract_title_keywords(title_text):
    """Extract key words from the title (after author info)."""
    # Remove author information (everything before the first uppercase word after author)
    # Split by common delimiters
    parts = re.split(r'[,\.](?=[A-Z])', title_text)
    
    # Find the title part (usually after authors)
    for part in parts:
        # Look for substantial text that looks like a title
        if len(part) > 20 and not re.match(r'^[A-Z]\.\s*$', part.strip()):
            title_part = part.strip()
            # Take first few meaningful words
            words = re.findall(r'\b[A-Z][a-z]+\b', title_part)
            if len(words) >= 2:
                return '_'.join(words[:4])  # First 4 capitalized words
    
    # Fallback: take first few words
    words = title_text.split()[:5]
    return '_'.join(w for w in words if len(w) > 3)[:40]

def generate_filename(title_text, url, index):
    """Generate an informative filename from publication metadata."""
    author = extract_first_author(title_text)
    year = extract_year(title_text)
    keywords = extract_title_keywords(title_text)
    
    # Build filename parts
    parts = []
    if author:
        parts.append(author)
    if year:
        parts.append(year)
    if keywords:
        parts.append(keywords)
    
    # If we couldn't extract anything meaningful, use index
    if not parts:
        parts.append(f"publication_{index:03d}")
    
    filename = '_'.join(parts)
    filename = sanitize_filename(filename)
    
    # Limit length
    if len(filename) > MAX_FILENAME_LENGTH:
        filename = filename[:MAX_FILENAME_LENGTH]
    
    return filename + '.pdf'

def download_pdf(url, output_path, max_retries=3):
    """Download a PDF with retry logic."""
    for attempt in range(max_retries):
        try:
            # Add delay to respect rate limits
            time.sleep(2)
            
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
            
            response = requests.get(url, headers=headers, timeout=30)
            response.raise_for_status()
            
            # Check if response is actually a PDF
            content_type = response.headers.get('content-type', '').lower()
            if 'pdf' not in content_type and not url.endswith('.pdf'):
                print(f"      Warning: Content-Type is {content_type}, may not be a PDF")
            
            # Save the file
            with open(output_path, 'wb') as f:
                f.write(response.content)
            
            return True
            
        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 429:  # Too Many Requests
                if attempt < max_retries - 1:
                    wait_time = 2 ** (attempt + 1)
                    print(f"      Rate limited. Waiting {wait_time} seconds...")
                    time.sleep(wait_time)
                else:
                    print(f"      Failed: {e}")
                    return False
            else:
                print(f"      Failed: {e}")
                return False
        except Exception as e:
            print(f"      Failed: {e}")
            return False
    
    return False

def safe_print(text):
    """Print text with fallback for Unicode errors."""
    try:
        print(text)
    except UnicodeEncodeError:
        # Replace problematic characters with ASCII equivalents
        print(text.encode('ascii', 'replace').decode('ascii'))

def main():
    # Create PDF folder if it doesn't exist
    pdf_folder = Path(PDF_FOLDER)
    pdf_folder.mkdir(exist_ok=True)
    
    safe_print(f"PDF folder: {pdf_folder.absolute()}\n")
    
    # Read CSV file
    if not Path(CSV_FILE).exists():
        safe_print(f"Error: {CSV_FILE} not found!")
        return
    
    with open(CSV_FILE, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        publications = list(reader)
    
    safe_print(f"Found {len(publications)} publications\n")
    
    # Track statistics
    downloaded = 0
    skipped = 0
    failed = 0
    
    # Download PDFs
    for i, pub in enumerate(publications, 1):
        title = pub['title']
        pdf_url = pub['pdf_link']
        
        safe_print(f"[{i}/{len(publications)}] {title[:60]}...")
        
        # Skip if no PDF link
        if not pdf_url or pdf_url == 'N/A':
            print("      Skipped: No PDF link available")
            skipped += 1
            continue
        
        # Generate filename
        filename = generate_filename(title, pdf_url, i)
        output_path = pdf_folder / filename
        
        # Skip if already downloaded
        if output_path.exists():
            safe_print(f"      Skipped: Already exists as {filename}")
            skipped += 1
            continue
        
        safe_print(f"      Downloading to: {filename}")
        
        # Download the PDF
        if download_pdf(pdf_url, output_path):
            safe_print(f"      Success!")
            downloaded += 1
        else:
            failed += 1
    
    # Summary
    safe_print("\n" + "="*70)
    safe_print("DOWNLOAD SUMMARY")
    safe_print("="*70)
    safe_print(f"Total publications:  {len(publications)}")
    safe_print(f"Successfully downloaded: {downloaded}")
    safe_print(f"Skipped (no PDF/exists): {skipped}")
    safe_print(f"Failed: {failed}")
    safe_print(f"\nPDFs saved to: {pdf_folder.absolute()}")

if __name__ == "__main__":
    main()
