# HUMAINT PDFs - Enhanced Download Report

## Summary

✅ **Successfully downloaded 43 PDFs** from 108 publications (40% success rate)

### Download Statistics

| Metric | Count | Change |
|--------|-------|--------|
| **Initial download (basic script)** | 22 PDFs | - |
| **Enhanced download (with open access extraction)** | 43 PDFs | **+21 PDFs** 📈 |
| **Total size** | 130.88 MB | +97.67 MB |
| **Success rate** | 40% | +20% |

## What the Enhanced Script Does

### 1. **Direct PDF Link Construction**
The script intelligently constructs PDF URLs for known patterns:
- ✅ **arXiv**: Converts `/abs/` to `/pdf/`
- ✅ **Springer**: Constructs `/content/pdf/{article_id}.pdf`
- ✅ **Taylor & Francis**: Constructs `/doi/pdf/{doi}`
- ✅ **SpringerOpen**: Constructs counter PDF URLs
- ✅ **OpenReview**: Direct attachment URLs
- ✅ **WorldScientific**: epdf URLs

### 2. **Page Scraping for Open Access**
For open access journals, the script:
- Looks for `<meta name="citation_pdf_url">` tags (most reliable)
- Searches for direct PDF links in `<a>` tags
- Identifies "Download PDF" buttons
- Parses journal-specific patterns

### 3. **Rate Limiting & Retry Logic**
- 2-second delays between downloads
- 1.5-second delays for page scraping
- Exponential backoff for 429 errors
- Timeout handling

## Successfully Downloaded From

### Open Access Sources ✅
- **Springer Open Access articles** (link.springer.com)
- **Taylor & Francis Open Access** (tandfonline.com)  
- **Journal of Big Data** (journalofbigdata.springeropen.com)
- **JRC Publications Repository** (publications.jrc.ec.europa.eu)
- **arXiv preprints** (arxiv.org)
- **OpenReview** (openreview.net)
- **IOS Press Open Access** (ebooks.iospress.nl)
- **WorldScientific epdf** (worldscientific.com)

### Still Requiring Manual Access ❌
- **IEEE Xplore** (institutional login required)
- **ACM Digital Library** (paywall)
- **Elsevier/ScienceDirect** (many paywalled)
- **Scopus** (database access required)
- **Some Springer articles** (subscription required)

## New PDFs Downloaded (Sample)

Recent additions from the enhanced run:
1. `Martínez-Plumed_Watch_Assessing_Technology_Readiness.pdf` (2.9 MB)
2. `De_Artificial_Intelligence_Digital_Transformation.pdf` (3.0 MB)
3. `Gómez-González_Artificial_Intelligence_Medicine_Healthcare.pdf` (4.2 MB)
4. `Samoili_Watch_Defining_Artificial_Intelligence.pdf` (2.1 MB)
5. `Charisi_Artificial_Intelligence_Rights_Child.pdf` (10.3 MB)
6. `Kriston_Kriston_Hamon_Fernandez_Llorca.pdf` (31.3 MB - largest file!)
7. `Abendroth_Abendroth_Dias.pdf` (9.9 MB)
8. `Gaudeul_Gaudeul_Arrigoni_Charisi_Escobar.pdf` (5.1 MB)

## Files in Project

### Scripts
- `obtain_publications.py` - Scrapes publication list from AI Watch
- `download_pdfs.py` - Basic PDF downloader (arXiv only)
- `download_pdfs_enhanced.py` - **Enhanced downloader with open access support** ⭐

### Data
- `ai_watch_publications.csv` - Complete catalog of 108 publications
- `humaint_pdfs/` - Folder with 43 downloaded PDFs

### Documentation
- `README_PDFs.md` - Project overview
- `DOWNLOAD_REPORT.md` - This file

## Usage

### To download/update PDFs:
```bash
python download_pdfs_enhanced.py
```

The script will:
- ✅ Skip already downloaded files
- ✅ Try to find PDF links for publications marked "N/A"
- ✅ Extract PDFs from open access journal pages
- ✅ Show progress and summary statistics

## Next Steps

### Option 1: Manual Download (65 remaining)
Use institutional access to download the remaining 65 publications from:
- IEEE Xplore
- ACM Digital Library
- Paywalled Springer/Elsevier articles

### Option 2: Analysis with Current Collection
The 43 PDFs (131 MB) are ready for:
- ✅ Text extraction and NLP
- ✅ Topic modeling and clustering
- ✅ Citation network analysis
- ✅ Keyword extraction
- ✅ Literature review synthesis
- ✅ Trend analysis across years

### Option 3: Advanced Automation (Optional)
- Add Selenium for JavaScript-rendered pages
- Configure institutional proxy settings
- Use publisher APIs with credentials

## Technical Improvements Made

1. **Smart PDF Detection**
   - Meta tag parsing for academic sites
   - Pattern matching for common publishers
   - Fallback strategies for different page structures

2. **Error Handling**
   - Unicode encoding fixes for Windows console
   - HTTP error retry logic
   - Timeout handling for slow servers

3. **Progress Tracking**
   - Real-time download status
   - Detailed summary statistics
   - File existence checks to avoid re-downloads

## Impact

**From 22 to 43 PDFs** - nearly **doubled the collection** with smart open access extraction! 🎉

This provides a substantial corpus for AI research analysis for your Colombia presentation.
