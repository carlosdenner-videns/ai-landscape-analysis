import requests
from bs4 import BeautifulSoup
import csv
import time
from urllib.parse import urljoin

BASE = "https://ai-watch.ec.europa.eu"
PUBLICATIONS_URL = "https://ai-watch.ec.europa.eu/humaint/publications_en"

def fetch_page(url, retries=3, backoff_factor=2):
    """
    Fetch a page with retry logic for rate limiting.
    """
    for attempt in range(retries):
        try:
            # Add delay before each request to respect rate limits
            time.sleep(2)  # 2 seconds between requests
            resp = requests.get(url)
            resp.raise_for_status()
            return resp.text
        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 429:  # Too Many Requests
                if attempt < retries - 1:
                    wait_time = backoff_factor ** (attempt + 1)
                    print(f"    Rate limited. Waiting {wait_time} seconds before retry...")
                    time.sleep(wait_time)
                else:
                    raise
            else:
                raise
    return None

def parse_publications_page(html):
    """
    Retorna uma lista de (title, publication_url) para cada publicação.
    As publicações estão em <ul> dentro de <main>, com links diretos para publicações externas.
    """
    soup = BeautifulSoup(html, "html.parser")
    items = []
    
    # Find the main content area
    main_content = soup.find('main')
    if not main_content:
        return items
    
    # Common domains for academic publications
    publication_domains = [
        'arxiv.org', 'dl.acm.org', 'publications.jrc.ec.europa.eu',
        'link.springer.com', 'ieeexplore.ieee.org', 'sciencedirect.com',
        'tandfonline.com', 'iospress.nl', 'openreview.net',
        'journalofbigdata.springeropen.com', 'worldscientific.com',
        'scopus.com', 'ebooks.iospress.nl', 'dssc.eu', 'doi.org'
    ]
    
    # Find all ul elements within main content
    ul_elements = main_content.find_all('ul')
    
    for ul in ul_elements:
        list_items = ul.find_all('li', recursive=False)
        for li in list_items:
            link = li.find('a', href=True)
            if link:
                href = link.get('href')
                # Check if this is an external publication link
                if any(domain in href for domain in publication_domains):
                    title = li.get_text(strip=True)
                    publication_url = urljoin(BASE, href)
                    items.append((title, publication_url))
    
    return items

def extract_pdf_link(publication_url):
    """
    Tenta extrair link direto do PDF a partir da URL da publicação.
    Para alguns domínios, a própria URL já é o PDF ou podemos inferir o link.
    """
    # Se a URL já é um PDF, retorna ela mesma
    if publication_url.lower().endswith('.pdf'):
        return publication_url
    
    # Para arXiv, converter para link PDF
    if 'arxiv.org/abs/' in publication_url:
        return publication_url.replace('/abs/', '/pdf/') + '.pdf'
    
    # Para a maioria dos casos, não há PDF direto conhecido
    return None

def scrape_publications(start_url):
    """
    Vasculhar publicações na página principal.
    """
    results = []
    print("Fetching", start_url)
    html = fetch_page(start_url)
    pubs = parse_publications_page(html)
    
    print(f"\nFound {len(pubs)} publications\n")
    
    for title, publication_url in pubs:
        print(f"  - {title[:80]}...")
        
        # Try to extract direct PDF link without fetching the page
        pdf_link = extract_pdf_link(publication_url)
        
        results.append({
            "title": title,
            "publication_url": publication_url,
            "pdf_link": pdf_link if pdf_link else "N/A"
        })
    
    return results

def save_csv(data, path):
    with open(path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["title", "publication_url", "pdf_link"])
        writer.writeheader()
        for row in data:
            writer.writerow(row)

if __name__ == "__main__":
    data = scrape_publications(PUBLICATIONS_URL)
    save_csv(data, "ai_watch_publications.csv")
    print(f"\nSalvo em ai_watch_publications.csv — total: {len(data)} publicações")
