# AI Research Landscape Analysis for Public Policy

> Comprehensive NLP-powered analysis of HUMAINT AI research publications using state-of-the-art topic modeling and transformer-based techniques.

[![Python](https://img.shields.io/badge/Python-3.8%2B-blue)](https://www.python.org/)
[![BERTopic](https://img.shields.io/badge/BERTopic-0.15%2B-green)](https://maartengr.github.io/BERTopic/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 📋 Overview

This repository contains a complete pipeline for:
1. **Scraping** AI research publications from the EU's HUMAINT initiative
2. **Downloading** PDFs from open access sources
3. **Analyzing** 700k+ words using modern NLP techniques
4. **Generating** landscape assessments for public policy research

### Key Results
- **42 research papers** analyzed
- **710,142 words** processed
- **24,304 unique terms** identified
- **5 policy areas** mapped with quantitative evidence
- **Publication-ready visualizations** generated

## 🚀 Quick Start

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/ai-landscape-analysis.git
cd ai-landscape-analysis

# Install dependencies
pip install -r requirements_analysis.txt
```

### 2. Run the Analysis

```bash
# Step 1: Scrape publications (optional - CSV already included)
python obtain_publications.py

# Step 2: Download PDFs (optional - requires institutional access for some)
python download_pdfs_enhanced.py

# Step 3: Run landscape analysis
python landscape_analysis.py
```

### 3. View Results

Open `landscape_analysis_output/LANDSCAPE_ASSESSMENT_REPORT.md` for the complete analysis.

## 📊 What's Included

### Scripts
- **`obtain_publications.py`** - Web scraper for HUMAINT publications
- **`download_pdfs_enhanced.py`** - Smart PDF downloader with open access extraction
- **`landscape_analysis.py`** - Full NLP analysis pipeline with BERTopic

### Data
- **`ai_watch_publications.csv`** - Catalog of 108 HUMAINT publications
- **`humaint_pdfs/`** - 43 downloaded PDFs (not included in repo - see below)
- **`landscape_analysis_output/`** - Complete analysis results

### Documentation
- **`SETUP_ANALYSIS.md`** - Detailed installation and usage guide
- **`HOW_TO_USE_FOR_COLOMBIA.md`** - Guide for public policy presentations
- **`ANALYSIS_SUMMARY.md`** - Executive summary of findings
- **`DOWNLOAD_REPORT.md`** - PDF collection summary

## 🔬 Technical Approach

### NLP Techniques Used
- **BERTopic**: State-of-the-art topic modeling with transformers
- **Sentence-BERT**: Semantic embeddings (all-MiniLM-L6-v2 model)
- **TF-IDF**: Term frequency-inverse document frequency analysis
- **HDBSCAN**: Hierarchical density-based clustering

### Text Processing
- **PyMuPDF & PyPDF2**: Dual fallback PDF text extraction
- **NLTK**: Tokenization and linguistic processing
- **scikit-learn**: Machine learning algorithms

### Visualizations
- Word clouds with custom styling
- Statistical charts and distributions
- Topic clustering visualizations
- Publication-ready graphics (300 DPI)

## 📈 Key Findings

### Research Priorities (by frequency)
1. **Data** - 3,031 occurrences → Data governance is central
2. **Systems** - 2,579 occurrences → System-level approaches
3. **Health** - 1,857 occurrences → Healthcare AI priority
4. **European** - 1,647 occurrences → Policy context
5. **Technology** - 1,599 occurrences → Innovation focus

### Policy Areas Identified
| Area | Relevance Score | Key Focus |
|------|----------------|-----------|
| AI Technology & Innovation | 13,514 | Algorithms, models, data science |
| AI Governance & Regulation | 7,558 | Policy, regulation, compliance |
| AI & Society | 6,001 | Social impact, human factors |
| AI Applications | 2,754 | Healthcare, autonomous systems |
| AI Ethics & Fairness | 2,534 | Bias, discrimination, transparency |

## 🎯 Use Cases

### For Researchers
- Literature review automation
- Topic discovery in large corpora
- Research gap identification
- Citation network analysis

### For Policymakers
- Evidence-based policy development
- Research priority mapping
- Stakeholder analysis
- International comparison (EU AI policy)

### For Students
- Understanding AI research landscape
- Public policy case studies
- Data-driven presentations
- Academic writing support

## 📁 Repository Structure

```
.
├── obtain_publications.py          # Web scraping script
├── download_pdfs_enhanced.py       # PDF downloader
├── landscape_analysis.py           # Main analysis pipeline
├── requirements_analysis.txt       # Python dependencies
├── ai_watch_publications.csv       # Publications catalog
│
├── landscape_analysis_output/      # Analysis results
│   ├── LANDSCAPE_ASSESSMENT_REPORT.md
│   ├── visualizations/
│   │   ├── wordcloud.png
│   │   ├── top_words.png
│   │   ├── document_lengths.png
│   │   └── topic_distribution.png
│   └── data/
│       ├── extracted_texts.json
│       ├── corpus_statistics.json
│       └── topic_assignments.csv
│
└── docs/                           # Documentation
    ├── SETUP_ANALYSIS.md
    ├── HOW_TO_USE_FOR_COLOMBIA.md
    ├── ANALYSIS_SUMMARY.md
    └── DOWNLOAD_REPORT.md
```

## 🔧 Configuration

### Customize Topic Modeling

Edit `landscape_analysis.py`:

```python
# Change number of topics
analyzer.perform_topic_modeling(n_topics=10)  # Default: 8

# Use traditional LDA instead of BERTopic
modeler = TopicModeler(n_topics=8, use_bertopic=False)
```

### Adjust Visualizations

```python
# Word cloud colors
wordcloud = WordCloud(colormap='plasma')  # Try: viridis, inferno, magma

# Chart style
plt.style.use('seaborn-v0_8')  # Or: ggplot, fivethirtyeight
```

## 📚 Data Sources

### HUMAINT Initiative
- **Source**: European Commission Joint Research Centre
- **URL**: https://ai-watch.ec.europa.eu/humaint_en
- **Focus**: Human behavior and machine intelligence
- **Publications**: 108 research papers (2018-2025)

### Open Access Papers
Successfully downloaded from:
- arXiv preprints
- Springer Open Access
- Taylor & Francis Open
- JRC Publications Repository
- IOS Press Open

## 🤝 Contributing

Contributions are welcome! Areas for improvement:

1. **Additional Data Sources**: Integrate other AI research repositories
2. **Enhanced Topic Modeling**: Experiment with different embedding models
3. **Temporal Analysis**: Add time-series analysis of research trends
4. **Network Analysis**: Citation and author network visualization
5. **Multi-language Support**: Extend beyond English publications

## 📝 Citation

If you use this work in your research, please cite:

```bibtex
@software{ai_landscape_analysis_2025,
  title = {AI Research Landscape Analysis for Public Policy},
  author = {Your Name},
  year = {2025},
  url = {https://github.com/YOUR_USERNAME/ai-landscape-analysis},
  note = {NLP-powered analysis using BERTopic and transformer models}
}
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **HUMAINT Initiative**: European Commission JRC for publishing open research
- **BERTopic**: Maarten Grootendorst for the excellent topic modeling library
- **Sentence-Transformers**: UKP Lab for semantic embedding models
- **Open Access Publishers**: For making research freely available

## 📧 Contact

For questions, suggestions, or collaboration:
- **GitHub Issues**: [Create an issue](https://github.com/YOUR_USERNAME/ai-landscape-analysis/issues)
- **Email**: your.email@example.com

## 🔗 Related Resources

- [HUMAINT Publications](https://ai-watch.ec.europa.eu/humaint/publications_en)
- [BERTopic Documentation](https://maartengr.github.io/BERTopic/)
- [Sentence-BERT](https://www.sbert.net/)
- [EU AI Act](https://artificialintelligenceact.eu/)

---

**Built with ❤️ for public policy research and evidence-based policymaking**

*Last updated: 2025-10-08*
