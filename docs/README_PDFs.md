# HUMAINT Publications PDF Download Summary

## Overview
This project scrapes and downloads academic publications from the AI Watch HUMAINT initiative.

## Files Created

### 1. `obtain_publications.py`
- Scrapes publication metadata from https://ai-watch.ec.europa.eu/humaint/publications_en
- Exports to `ai_watch_publications.csv`
- **Total publications found**: 108

### 2. `download_pdfs.py`
- Downloads PDFs with direct links
- Creates informative filenames based on author, year, and title keywords
- Saves to `humaint_pdfs/` folder

### 3. `ai_watch_publications.csv`
Contains all 108 publications with columns:
- `title`: Full publication title with authors
- `publication_url`: Link to the publication page
- `pdf_link`: Direct PDF link (if available) or "N/A"

### 4. `humaint_pdfs/` folder
Contains **22 downloaded PDFs** (~33 MB total)
- Primarily from arXiv (direct PDF links)
- Filenames format: `LastName_Year_Keywords.pdf`
- Examples:
  - `Eriksson_Eriksson_Purificato_Noroozian_Vinagre.pdf`
  - `Gómez_Deep_Learning_Singing_Processing.pdf`
  - `Hernández_Hernández_Martínez_al.,Data-driven_vehic.pdf`

## Download Statistics

| Metric | Count |
|--------|-------|
| Total publications in CSV | 108 |
| PDFs with direct links | ~22 |
| Successfully downloaded | 22 |
| PDFs requiring manual access | ~86 |

## Why Only 22 PDFs?

Most publications (86 out of 108) are hosted on platforms that require:
- Interactive access (e.g., ACM Digital Library, IEEE Xplore)
- Institutional login
- Publisher paywalls
- Dynamic page rendering

Publications from these sources were cataloged but not auto-downloaded:
- ACM Digital Library
- Springer Link
- IEEE Xplore
- ScienceDirect
- JRC Publications Repository

## Next Steps

### Option 1: Manual Download
Use the CSV file to access publications that require institutional access.

### Option 2: Enhance Script
For more downloads, you could:
1. Add Selenium/Playwright for dynamic pages
2. Configure institutional credentials (if available)
3. Use publisher APIs with authentication
4. Extract DOIs and use legal API services

### Option 3: Analysis with Current PDFs
The 22 downloaded PDFs (primarily arXiv preprints) are ready for:
- Text extraction and NLP analysis
- Topic modeling
- Citation analysis
- Content summarization

## Usage

### Scrape Publications
```bash
python obtain_publications.py
```

### Download PDFs
```bash
python download_pdfs.py
```

Both scripts include:
- Rate limiting (2-second delays)
- Retry logic for 429 errors
- Progress tracking
- Error handling

## Notes

- The scripts respect rate limits to avoid overwhelming servers
- Downloaded PDFs use sanitized filenames (Windows-compatible)
- The CSV serves as a complete catalog even if PDFs can't be auto-downloaded
- arXiv papers automatically get converted to direct PDF links
