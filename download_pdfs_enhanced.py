import csv
import os
import time
import re
import requests
from pathlib import Path
from urllib.parse import urlparse
from bs4 import BeautifulSoup

# Configuration
CSV_FILE = "ai_watch_publications.csv"
PDF_FOLDER = "humaint_pdfs"
MAX_FILENAME_LENGTH = 80

def sanitize_filename(filename):
    """Remove or replace characters that are invalid in filenames."""
    filename = re.sub(r'[<>:"/\\|?*]', '_', filename)
    filename = re.sub(r'[_\s]+', '_', filename)
    filename = filename.strip('_. ')
    return filename

def extract_first_author(title_text):
    """Extract the first author's last name from the publication text."""
    match = re.match(r'^([A-Za-zÀ-ÿ\-]+),?\s+[A-Z]\.?', title_text)
    if match:
        return match.group(1)
    
    match = re.match(r'^([A-Za-zÀ-ÿ\-]+)\s+et\s+al', title_text, re.IGNORECASE)
    if match:
        return match.group(1)
    
    return None

def extract_year(title_text):
    """Extract year from the title text."""
    years = re.findall(r'\b(20[12]\d)\b', title_text)
    if years:
        return years[0]
    return None

def extract_title_keywords(title_text):
    """Extract key words from the title (after author info)."""
    parts = re.split(r'[,\.](?=[A-Z])', title_text)
    
    for part in parts:
        if len(part) > 20 and not re.match(r'^[A-Z]\.\s*$', part.strip()):
            title_part = part.strip()
            words = re.findall(r'\b[A-Z][a-z]+\b', title_part)
            if len(words) >= 2:
                return '_'.join(words[:4])
    
    words = title_text.split()[:5]
    return '_'.join(w for w in words if len(w) > 3)[:40]

def generate_filename(title_text, url, index):
    """Generate an informative filename from publication metadata."""
    author = extract_first_author(title_text)
    year = extract_year(title_text)
    keywords = extract_title_keywords(title_text)
    
    parts = []
    if author:
        parts.append(author)
    if year:
        parts.append(year)
    if keywords:
        parts.append(keywords)
    
    if not parts:
        parts.append(f"publication_{index:03d}")
    
    filename = '_'.join(parts)
    filename = sanitize_filename(filename)
    
    if len(filename) > MAX_FILENAME_LENGTH:
        filename = filename[:MAX_FILENAME_LENGTH]
    
    return filename + '.pdf'

def extract_pdf_from_page(url, max_retries=2):
    """
    Tenta extrair link do PDF visitando a página da publicação (para open access).
    """
    for attempt in range(max_retries):
        try:
            time.sleep(1.5)
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
            
            response = requests.get(url, headers=headers, timeout=15)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Strategy 1: Meta tag citation_pdf_url (most reliable)
            for meta in soup.find_all('meta'):
                if meta.get('name') == 'citation_pdf_url' or meta.get('property') == 'citation_pdf_url':
                    pdf_url = meta.get('content')
                    if pdf_url:
                        return requests.compat.urljoin(url, pdf_url)
            
            # Strategy 2: Direct PDF links
            for a in soup.find_all('a', href=True):
                href = a.get('href')
                if href.lower().endswith('.pdf'):
                    return requests.compat.urljoin(url, href)
            
            # Strategy 3: Common PDF download button text
            pdf_patterns = [
                'download pdf', 'pdf download', 'download article',
                'full text pdf', 'view pdf', 'get pdf', 'pdf full-text'
            ]
            for a in soup.find_all('a', href=True):
                text = a.get_text(strip=True).lower()
                if any(pattern in text for pattern in pdf_patterns):
                    href = a.get('href')
                    if href and 'pdf' in href.lower():
                        return requests.compat.urljoin(url, href)
            
            return None
            
        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 429 and attempt < max_retries - 1:
                time.sleep(3)
            else:
                return None
        except Exception:
            return None
    
    return None

def extract_pdf_link(publication_url, try_page_scraping=True):
    """
    Tenta extrair link direto do PDF a partir da URL da publicação.
    """
    # Se a URL já é um PDF
    if publication_url.lower().endswith('.pdf'):
        return publication_url
    
    # arXiv
    if 'arxiv.org/abs/' in publication_url:
        return publication_url.replace('/abs/', '/pdf/') + '.pdf'
    
    # OpenReview com attachment é PDF
    if 'openreview.net' in publication_url and 'attachment' in publication_url:
        return publication_url
    
    # WorldScientific epdf
    if 'worldscientific.com' in publication_url and '/epdf/' in publication_url:
        return publication_url
    
    # Springer articles (try constructing PDF URL)
    if 'springer.com/article/' in publication_url:
        try:
            article_id = publication_url.split('/')[-1].split('?')[0]
            return f"https://link.springer.com/content/pdf/{article_id}.pdf"
        except:
            pass
    
    # Taylor & Francis / tandfonline
    if 'tandfonline.com/doi/' in publication_url:
        try:
            doi_part = publication_url.split('/doi/')[-1].split('?')[0].split('#')[0]
            return f"https://www.tandfonline.com/doi/pdf/{doi_part}"
        except:
            pass
    
    # Journal of Big Data (SpringerOpen)
    if 'journalofbigdata.springeropen.com' in publication_url:
        try:
            article_id = publication_url.split('/')[-1]
            return f"https://journalofbigdata.springeropen.com/counter/pdf/{article_id}.pdf"
        except:
            pass
    
    # IOS Press ebooks
    if 'ebooks.iospress.nl' in publication_url:
        try:
            # Try to extract PDF from page
            if try_page_scraping:
                return extract_pdf_from_page(publication_url)
        except:
            pass
    
    # For other domains, try scraping if enabled
    if try_page_scraping:
        # Only try for domains that are likely open access
        open_access_domains = [
            'springeropen.com', 'sciencedirect.com', 'tandfonline.com',
            'publications.jrc.ec.europa.eu', 'iospress.nl'
        ]
        if any(domain in publication_url for domain in open_access_domains):
            return extract_pdf_from_page(publication_url)
    
    return None

def download_pdf(url, output_path, max_retries=3):
    """Download a PDF with retry logic."""
    for attempt in range(max_retries):
        try:
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
            if e.response.status_code == 429:
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
        print(text.encode('ascii', 'replace').decode('ascii'))

def main():
    pdf_folder = Path(PDF_FOLDER)
    pdf_folder.mkdir(exist_ok=True)
    
    safe_print(f"PDF folder: {pdf_folder.absolute()}\n")
    safe_print("Enhanced mode: Will try to extract PDFs from open access journals\n")
    
    if not Path(CSV_FILE).exists():
        safe_print(f"Error: {CSV_FILE} not found!")
        return
    
    with open(CSV_FILE, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        publications = list(reader)
    
    safe_print(f"Found {len(publications)} publications\n")
    
    # Track statistics
    downloaded = 0
    skipped_no_link = 0
    skipped_exists = 0
    failed = 0
    
    for i, pub in enumerate(publications, 1):
        title = pub['title']
        pdf_url = pub['pdf_link']
        publication_url = pub['publication_url']
        
        safe_print(f"[{i}/{len(publications)}] {title[:60]}...")
        
        # If no direct PDF link in CSV, try to find one
        if not pdf_url or pdf_url == 'N/A':
            safe_print("      No direct PDF link, trying to extract...")
            pdf_url = extract_pdf_link(publication_url, try_page_scraping=True)
            
            if pdf_url:
                safe_print(f"      Found PDF link!")
            else:
                safe_print("      No PDF found - skipping")
                skipped_no_link += 1
                continue
        
        # Generate filename
        filename = generate_filename(title, pdf_url, i)
        output_path = pdf_folder / filename
        
        # Skip if already downloaded
        if output_path.exists():
            safe_print(f"      Already exists: {filename}")
            skipped_exists += 1
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
    safe_print(f"Total publications:       {len(publications)}")
    safe_print(f"Successfully downloaded:  {downloaded}")
    safe_print(f"Already existed:          {skipped_exists}")
    safe_print(f"No PDF link found:        {skipped_no_link}")
    safe_print(f"Failed to download:       {failed}")
    safe_print(f"\nPDFs saved to: {pdf_folder.absolute()}")

if __name__ == "__main__":
    main()
