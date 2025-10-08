# AI-Powered Landscape Analysis Setup Guide

## Overview

This script performs state-of-the-art NLP analysis on the HUMAINT publications to create a comprehensive landscape assessment for public policy students.

## Features

### 🤖 Modern AI Techniques
- **BERTopic** - State-of-the-art topic modeling using transformers
- **Sentence Transformers** - Semantic embeddings for better topic discovery
- **Traditional LDA** - Fallback if BERTopic is not available

### 📊 Analysis Components
1. **Text Extraction** - Intelligent PDF parsing with multiple fallbacks
2. **Preprocessing** - Advanced text cleaning and normalization
3. **Topic Modeling** - Discovers latent themes in the research
4. **Statistical Analysis** - Corpus-level metrics and insights
5. **Visualizations** - Publication-ready charts and word clouds
6. **Landscape Report** - Comprehensive markdown report for policy students

### 📈 Outputs Generated
- **Word Cloud** - Visual representation of key terms
- **Topic Distribution** - Document clustering visualization
- **Frequency Analysis** - Top terms and themes
- **Detailed Report** - Markdown document with insights
- **Data Files** - JSON and CSV for further analysis

## Installation

### Step 1: Install Required Packages

#### Basic Installation (uses traditional LDA)
```bash
pip install PyPDF2 PyMuPDF numpy pandas scikit-learn nltk matplotlib seaborn wordcloud
```

#### Full Installation (recommended - uses BERTopic)
```bash
pip install -r requirements_analysis.txt
```

### Step 2: Download NLTK Data
The script will automatically download required NLTK data on first run.

## Usage

### Run the Analysis
```bash
python landscape_analysis.py
```

### What Happens
1. Extracts text from all PDFs in `humaint_pdfs/`
2. Preprocesses and cleans the text
3. Performs topic modeling to discover themes
4. Generates statistics and visualizations
5. Creates a comprehensive landscape assessment report

### Expected Runtime
- Text extraction: ~2-5 minutes (43 PDFs)
- Preprocessing: ~30 seconds
- Topic modeling: ~1-3 minutes (faster with GPU)
- Visualizations: ~30 seconds
- **Total: ~5-10 minutes**

## Output Structure

```
landscape_analysis_output/
├── LANDSCAPE_ASSESSMENT_REPORT.md    # Main report
├── visualizations/
│   ├── wordcloud.png                 # Word cloud visualization
│   ├── document_lengths.png          # Length distribution
│   ├── top_words.png                 # Top 20 terms
│   └── topic_distribution.png        # Topics per document
└── data/
    ├── extracted_texts.json          # Full text data
    ├── corpus_statistics.json        # Detailed stats
    └── topic_assignments.csv         # Document-topic mapping
```

## Understanding the Results

### The Report Contains

1. **Executive Summary**
   - Corpus size and scope
   - Basic statistics

2. **Key Research Themes**
   - Most frequent terms
   - Thematic clusters

3. **Discovered Topics**
   - Automatically identified research areas
   - Key terms per topic
   - Example publications

4. **Policy-Relevant Areas**
   - AI Governance & Regulation
   - AI Ethics & Fairness
   - AI & Society
   - AI Technology & Innovation
   - AI Applications

5. **Recommendations**
   - Further research directions
   - Gap analysis

### Visualizations Explained

**Word Cloud**
- Larger words = more frequent
- Shows dominant themes at a glance

**Topic Distribution**
- How documents cluster by theme
- Identifies research concentration areas

**Top Words Chart**
- Quantitative view of term frequency
- Helps identify research focus areas

## Customization

### Change Number of Topics
Edit line in `landscape_analysis.py`:
```python
analyzer.perform_topic_modeling(n_topics=8)  # Change to 5, 10, 12, etc.
```

### Add Custom Stop Words
Modify `TextPreprocessor.__init__()`:
```python
self.stop_words.update([
    'your', 'custom', 'words', 'here'
])
```

### Adjust Visualization Style
Modify color schemes in `create_visualizations()`:
```python
colormap='viridis'  # Try: 'plasma', 'inferno', 'magma'
```

## For Public Policy Students

### How to Use This Analysis

1. **Identify Research Gaps**
   - Look at topic distribution
   - Find underrepresented areas

2. **Literature Review Foundation**
   - Use topic assignments to group related papers
   - Extract key terms for each policy area

3. **Policy Brief Development**
   - Use statistics for context
   - Reference key themes in argumentation

4. **Stakeholder Analysis**
   - Identify which topics are well-researched
   - Determine which need more attention

5. **Trend Analysis**
   - Compare topics to policy priorities
   - Identify emerging vs. established areas

## Troubleshooting

### Issue: "No module named 'bertopic'"
**Solution:** BERTopic is optional. The script will use traditional LDA.
For better results: `pip install bertopic sentence-transformers`

### Issue: "Could not extract text from PDFs"
**Solution:** 
- Check if PDFs are in `humaint_pdfs/` folder
- Some PDFs may be scanned images (need OCR)
- Try updating PyMuPDF: `pip install --upgrade PyMuPDF`

### Issue: Memory errors with large corpus
**Solution:**
- Reduce number of topics: `n_topics=5`
- Process PDFs in batches
- Use lighter transformer model in code

### Issue: Slow performance
**Solution:**
- Install BERTopic with GPU support
- Reduce number of documents
- Use traditional LDA (faster but less accurate)

## Technical Details

### Methods Used

**Text Extraction**
- PyMuPDF (primary) - Better text quality
- PyPDF2 (fallback) - Wider compatibility

**Preprocessing**
- Tokenization with NLTK
- Stop word removal (English + academic terms)
- Lemmatization and normalization

**Topic Modeling**
- BERTopic: Transformer-based semantic modeling
- LDA: Traditional probabilistic topic modeling
- Sentence-BERT embeddings for semantic similarity

**Visualization**
- Matplotlib/Seaborn for charts
- WordCloud for term visualization
- Custom styling for publication quality

## Next Steps

After running the analysis:

1. **Review the Report**
   - Read `LANDSCAPE_ASSESSMENT_REPORT.md`
   - Examine visualizations

2. **Explore the Data**
   - Check `topic_assignments.csv` for document clustering
   - Use `extracted_texts.json` for detailed analysis

3. **Deep Dive**
   - Select a topic of interest
   - Read papers assigned to that topic
   - Build targeted literature review

4. **Create Policy Brief**
   - Use insights for policy recommendations
   - Reference research gaps
   - Support with evidence from corpus

## References

- **BERTopic**: Grootendorst, M. (2022). BERTopic: Neural topic modeling with a class-based TF-IDF procedure
- **Sentence-BERT**: Reimers & Gurevych (2019). Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks
- **Topic Modeling**: Blei, D. M., Ng, A. Y., & Jordan, M. I. (2003). Latent Dirichlet Allocation

## Support

For issues or questions:
1. Check this guide's Troubleshooting section
2. Review the code comments in `landscape_analysis.py`
3. Consult the individual library documentation

---

**Happy Analyzing! 🎓📊🤖**
