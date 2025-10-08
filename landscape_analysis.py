"""
AI-Powered Literature Landscape Analysis
Uses modern NLP techniques for topic modeling and literature review generation
for public policy students
"""

import os
import re
import json
from pathlib import Path
from datetime import datetime
from collections import Counter, defaultdict
import warnings
warnings.filterwarnings('ignore')

# PDF and text processing
import PyPDF2
import fitz  # PyMuPDF - better for text extraction

# NLP and ML
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
from sklearn.decomposition import LatentDirichletAllocation
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize

# Modern topic modeling
try:
    from bertopic import BERTopic
    from sentence_transformers import SentenceTransformer
    BERTOPIC_AVAILABLE = True
except ImportError:
    BERTOPIC_AVAILABLE = False
    print("BERTopic not available. Will use traditional LDA instead.")
    print("To install: pip install bertopic sentence-transformers")

# Visualization
import matplotlib.pyplot as plt
import seaborn as sns
from wordcloud import WordCloud

# Configuration
PDF_FOLDER = "humaint_pdfs"
OUTPUT_FOLDER = "landscape_analysis_output"
CSV_FILE = "ai_watch_publications.csv"

# Download NLTK data if needed
try:
    stopwords.words('english')
except LookupError:
    nltk.download('stopwords', quiet=True)
    nltk.download('punkt', quiet=True)
    nltk.download('averaged_perceptron_tagger', quiet=True)

class PDFTextExtractor:
    """Extract and clean text from PDF files."""
    
    def __init__(self, pdf_folder):
        self.pdf_folder = Path(pdf_folder)
        
    def extract_text_pymupdf(self, pdf_path):
        """Extract text using PyMuPDF (better quality)."""
        try:
            doc = fitz.open(pdf_path)
            text = ""
            for page in doc:
                text += page.get_text()
            doc.close()
            return text
        except Exception as e:
            print(f"  PyMuPDF failed for {pdf_path.name}: {e}")
            return None
    
    def extract_text_pypdf2(self, pdf_path):
        """Fallback: Extract text using PyPDF2."""
        try:
            with open(pdf_path, 'rb') as file:
                reader = PyPDF2.PdfReader(file)
                text = ""
                for page in reader.pages:
                    text += page.extract_text()
            return text
        except Exception as e:
            print(f"  PyPDF2 failed for {pdf_path.name}: {e}")
            return None
    
    def clean_text(self, text):
        """Clean extracted text."""
        if not text:
            return ""
        
        # Remove excessive whitespace
        text = re.sub(r'\s+', ' ', text)
        
        # Remove URLs
        text = re.sub(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', '', text)
        
        # Remove email addresses
        text = re.sub(r'\S+@\S+', '', text)
        
        # Remove special characters but keep periods, commas, and basic punctuation
        text = re.sub(r'[^\w\s.,!?;:\-()]', ' ', text)
        
        # Remove numbers that are standalone (keep years like 2024)
        text = re.sub(r'\b\d{1,3}\b', '', text)
        
        return text.strip()
    
    def extract_all(self):
        """Extract text from all PDFs in folder."""
        pdf_files = list(self.pdf_folder.glob("*.pdf"))
        
        print(f"\nExtracting text from {len(pdf_files)} PDFs...")
        
        documents = []
        for i, pdf_path in enumerate(pdf_files, 1):
            print(f"  [{i}/{len(pdf_files)}] {pdf_path.name}")
            
            # Try PyMuPDF first (better quality)
            text = self.extract_text_pymupdf(pdf_path)
            
            # Fallback to PyPDF2
            if not text or len(text.strip()) < 100:
                text = self.extract_text_pypdf2(pdf_path)
            
            if text and len(text.strip()) > 100:
                cleaned_text = self.clean_text(text)
                documents.append({
                    'filename': pdf_path.name,
                    'text': cleaned_text,
                    'word_count': len(cleaned_text.split()),
                    'char_count': len(cleaned_text)
                })
            else:
                print(f"    Warning: Could not extract meaningful text")
        
        print(f"\nSuccessfully extracted text from {len(documents)} documents")
        return documents


class TextPreprocessor:
    """Preprocess text for NLP analysis."""
    
    def __init__(self, language='english'):
        self.stop_words = set(stopwords.words(language))
        # Add custom stop words for academic papers
        self.stop_words.update([
            'et', 'al', 'fig', 'figure', 'table', 'doi', 'http', 'https',
            'arxiv', 'preprint', 'abstract', 'introduction', 'conclusion',
            'paper', 'study', 'research', 'article', 'author', 'results'
        ])
    
    def preprocess(self, text, min_word_length=3):
        """Preprocess text for analysis."""
        # Lowercase
        text = text.lower()
        
        # Tokenize
        tokens = word_tokenize(text)
        
        # Remove stop words and short words
        tokens = [
            word for word in tokens 
            if word not in self.stop_words 
            and len(word) >= min_word_length
            and word.isalpha()
        ]
        
        return ' '.join(tokens)
    
    def extract_key_phrases(self, text, top_n=20):
        """Extract key phrases using TF-IDF."""
        # Split into sentences
        sentences = sent_tokenize(text)
        
        if len(sentences) < 2:
            return []
        
        # Use TF-IDF to find important phrases
        vectorizer = TfidfVectorizer(
            max_features=top_n,
            ngram_range=(1, 3),
            stop_words='english'
        )
        
        try:
            tfidf_matrix = vectorizer.fit_transform([text])
            feature_names = vectorizer.get_feature_names_out()
            scores = tfidf_matrix.toarray()[0]
            
            # Get top phrases
            top_indices = scores.argsort()[-top_n:][::-1]
            key_phrases = [feature_names[i] for i in top_indices if scores[i] > 0]
            
            return key_phrases
        except:
            return []


class TopicModeler:
    """Perform topic modeling using BERTopic or LDA."""
    
    def __init__(self, n_topics=10, use_bertopic=True):
        self.n_topics = n_topics
        self.use_bertopic = use_bertopic and BERTOPIC_AVAILABLE
        self.model = None
        self.topics = None
        
    def fit_bertopic(self, documents):
        """Fit BERTopic model (state-of-the-art)."""
        print("\nUsing BERTopic for topic modeling...")
        
        # Use a good sentence transformer model
        embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        
        # Create BERTopic model
        self.model = BERTopic(
            embedding_model=embedding_model,
            nr_topics=self.n_topics,
            calculate_probabilities=True,
            verbose=False
        )
        
        # Fit model
        topics, probs = self.model.fit_transform(documents)
        
        return topics, probs
    
    def fit_lda(self, documents):
        """Fit traditional LDA model (fallback)."""
        print("\nUsing LDA for topic modeling...")
        
        # Vectorize
        vectorizer = CountVectorizer(
            max_features=1000,
            max_df=0.8,
            min_df=2,
            stop_words='english'
        )
        
        doc_term_matrix = vectorizer.fit_transform(documents)
        
        # Fit LDA
        self.model = LatentDirichletAllocation(
            n_components=self.n_topics,
            random_state=42,
            max_iter=50
        )
        
        topics = self.model.fit_transform(doc_term_matrix)
        
        # Get top words per topic
        feature_names = vectorizer.get_feature_names_out()
        
        return topics, feature_names
    
    def fit(self, documents):
        """Fit topic model."""
        if self.use_bertopic:
            return self.fit_bertopic(documents)
        else:
            return self.fit_lda(documents)
    
    def get_topic_info(self):
        """Get information about discovered topics."""
        if self.use_bertopic and self.model:
            return self.model.get_topic_info()
        return None
    
    def get_topic_words(self, topic_id, top_n=10):
        """Get top words for a topic."""
        if self.use_bertopic and self.model:
            return self.model.get_topic(topic_id)[:top_n]
        return []


class LandscapeAnalyzer:
    """Main class for landscape analysis."""
    
    def __init__(self, pdf_folder, output_folder):
        self.pdf_folder = pdf_folder
        self.output_folder = Path(output_folder)
        self.output_folder.mkdir(exist_ok=True)
        
        self.documents = []
        self.processed_docs = []
        self.topics = None
        
        # Create subdirectories
        (self.output_folder / "visualizations").mkdir(exist_ok=True)
        (self.output_folder / "data").mkdir(exist_ok=True)
    
    def extract_texts(self):
        """Extract text from PDFs."""
        extractor = PDFTextExtractor(self.pdf_folder)
        self.documents = extractor.extract_all()
        
        # Save extracted texts
        with open(self.output_folder / "data" / "extracted_texts.json", 'w', encoding='utf-8') as f:
            json.dump(self.documents, f, indent=2, ensure_ascii=False)
        
        return self.documents
    
    def preprocess_texts(self):
        """Preprocess texts for analysis."""
        print("\nPreprocessing texts...")
        preprocessor = TextPreprocessor()
        
        self.processed_docs = []
        for doc in self.documents:
            processed = preprocessor.preprocess(doc['text'])
            self.processed_docs.append({
                'filename': doc['filename'],
                'original_text': doc['text'],
                'processed_text': processed,
                'word_count': len(processed.split())
            })
        
        return self.processed_docs
    
    def perform_topic_modeling(self, n_topics=8):
        """Perform topic modeling."""
        print(f"\nPerforming topic modeling with {n_topics} topics...")
        
        # Get processed texts
        texts = [doc['processed_text'] for doc in self.processed_docs]
        
        # Fit topic model
        modeler = TopicModeler(n_topics=n_topics, use_bertopic=BERTOPIC_AVAILABLE)
        topics, probs = modeler.fit(texts)
        
        # Store results
        self.topic_model = modeler
        self.topics = topics
        
        # Add topic assignments to documents
        for i, doc in enumerate(self.processed_docs):
            if isinstance(topics, np.ndarray):
                doc['topic'] = int(np.argmax(topics[i]))
            else:
                doc['topic'] = int(topics[i])
        
        return modeler
    
    def generate_statistics(self):
        """Generate corpus statistics."""
        print("\nGenerating statistics...")
        
        stats = {
            'total_documents': len(self.documents),
            'total_words': sum(doc['word_count'] for doc in self.documents),
            'avg_words_per_doc': np.mean([doc['word_count'] for doc in self.documents]),
            'median_words_per_doc': np.median([doc['word_count'] for doc in self.documents]),
            'min_words': min(doc['word_count'] for doc in self.documents),
            'max_words': max(doc['word_count'] for doc in self.documents)
        }
        
        # Word frequency analysis
        all_words = []
        for doc in self.processed_docs:
            all_words.extend(doc['processed_text'].split())
        
        word_freq = Counter(all_words)
        stats['unique_words'] = len(word_freq)
        stats['top_20_words'] = word_freq.most_common(20)
        
        # Save statistics
        with open(self.output_folder / "data" / "corpus_statistics.json", 'w') as f:
            json.dump(stats, f, indent=2)
        
        return stats
    
    def create_visualizations(self, stats):
        """Create visualizations."""
        print("\nCreating visualizations...")
        
        viz_folder = self.output_folder / "visualizations"
        
        # 1. Word Cloud
        all_text = ' '.join([doc['processed_text'] for doc in self.processed_docs])
        wordcloud = WordCloud(
            width=1200, 
            height=600, 
            background_color='white',
            colormap='viridis',
            max_words=100
        ).generate(all_text)
        
        plt.figure(figsize=(15, 8))
        plt.imshow(wordcloud, interpolation='bilinear')
        plt.axis('off')
        plt.title('Most Frequent Terms in HUMAINT Literature', fontsize=20, pad=20)
        plt.tight_layout()
        plt.savefig(viz_folder / "wordcloud.png", dpi=300, bbox_inches='tight')
        plt.close()
        
        # 2. Document length distribution
        word_counts = [doc['word_count'] for doc in self.documents]
        
        plt.figure(figsize=(12, 6))
        plt.hist(word_counts, bins=20, color='steelblue', edgecolor='black', alpha=0.7)
        plt.xlabel('Word Count', fontsize=12)
        plt.ylabel('Number of Documents', fontsize=12)
        plt.title('Distribution of Document Lengths', fontsize=14)
        plt.axvline(np.mean(word_counts), color='red', linestyle='--', label=f'Mean: {np.mean(word_counts):.0f}')
        plt.legend()
        plt.grid(alpha=0.3)
        plt.tight_layout()
        plt.savefig(viz_folder / "document_lengths.png", dpi=300, bbox_inches='tight')
        plt.close()
        
        # 3. Top 20 words bar chart
        top_words, top_counts = zip(*stats['top_20_words'])
        
        plt.figure(figsize=(12, 8))
        plt.barh(range(len(top_words)), top_counts, color='teal', alpha=0.8)
        plt.yticks(range(len(top_words)), top_words)
        plt.xlabel('Frequency', fontsize=12)
        plt.title('Top 20 Most Frequent Terms', fontsize=14)
        plt.gca().invert_yaxis()
        plt.grid(axis='x', alpha=0.3)
        plt.tight_layout()
        plt.savefig(viz_folder / "top_words.png", dpi=300, bbox_inches='tight')
        plt.close()
        
        # 4. Topic distribution (if available)
        if hasattr(self, 'topics') and self.topics is not None:
            topic_counts = Counter([doc['topic'] for doc in self.processed_docs])
            
            plt.figure(figsize=(12, 6))
            topics_list = sorted(topic_counts.keys())
            counts = [topic_counts[t] for t in topics_list]
            
            plt.bar(topics_list, counts, color='coral', alpha=0.8, edgecolor='black')
            plt.xlabel('Topic ID', fontsize=12)
            plt.ylabel('Number of Documents', fontsize=12)
            plt.title('Documents per Topic', fontsize=14)
            plt.xticks(topics_list)
            plt.grid(axis='y', alpha=0.3)
            plt.tight_layout()
            plt.savefig(viz_folder / "topic_distribution.png", dpi=300, bbox_inches='tight')
            plt.close()
        
        print(f"  Visualizations saved to {viz_folder}/")
    
    def generate_report(self, stats):
        """Generate final landscape assessment report."""
        print("\nGenerating landscape assessment report...")
        
        report_path = self.output_folder / "LANDSCAPE_ASSESSMENT_REPORT.md"
        
        with open(report_path, 'w', encoding='utf-8') as f:
            f.write("# AI Research Landscape Assessment\n")
            f.write("## HUMAINT Publications Analysis\n\n")
            f.write(f"**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
            f.write("---\n\n")
            
            # Executive Summary
            f.write("## Executive Summary\n\n")
            f.write(f"This landscape assessment analyzes **{stats['total_documents']} research publications** ")
            f.write(f"from the European Commission's HUMAINT initiative on AI and society.\n\n")
            f.write(f"- **Total corpus size:** {stats['total_words']:,} words\n")
            f.write(f"- **Unique terms:** {stats['unique_words']:,}\n")
            f.write(f"- **Average document length:** {stats['avg_words_per_doc']:.0f} words\n")
            f.write(f"- **Document range:** {stats['min_words']:,} to {stats['max_words']:,} words\n\n")
            
            # Key Themes
            f.write("## Key Research Themes\n\n")
            f.write("Based on frequency analysis, the most prominent themes include:\n\n")
            
            for i, (word, count) in enumerate(stats['top_20_words'][:10], 1):
                f.write(f"{i}. **{word.title()}** ({count:,} occurrences)\n")
            
            f.write("\n")
            
            # Topic Analysis
            if hasattr(self, 'topic_model') and self.topic_model:
                f.write("## Discovered Research Topics\n\n")
                
                if BERTOPIC_AVAILABLE and self.topic_model.use_bertopic:
                    topic_info = self.topic_model.get_topic_info()
                    
                    for idx in range(min(8, len(topic_info))):
                        if idx == 0:  # Skip outlier topic
                            continue
                        
                        topic_words = self.topic_model.get_topic_words(idx)
                        if topic_words:
                            f.write(f"### Topic {idx}\n\n")
                            
                            # Get documents in this topic
                            topic_docs = [doc['filename'] for doc in self.processed_docs if doc.get('topic') == idx]
                            
                            f.write(f"**Key terms:** {', '.join([word for word, score in topic_words[:8]])}\n\n")
                            f.write(f"**Documents in this topic:** {len(topic_docs)}\n\n")
                            
                            if topic_docs:
                                f.write("**Example publications:**\n")
                                for doc in topic_docs[:3]:
                                    f.write(f"- {doc}\n")
                            f.write("\n")
                else:
                    f.write("*Traditional LDA topic modeling was used. ")
                    f.write("For better results, install BERTopic: `pip install bertopic sentence-transformers`*\n\n")
            
            # Research Areas for Public Policy
            f.write("## Key Areas for Public Policy Students\n\n")
            f.write("Based on this landscape analysis, the following research areas are prominent:\n\n")
            
            # Identify policy-relevant terms
            policy_terms = {
                'AI Governance & Regulation': ['regulation', 'policy', 'governance', 'act', 'law', 'compliance'],
                'AI Ethics & Fairness': ['ethical', 'fairness', 'bias', 'discrimination', 'transparency'],
                'AI & Society': ['social', 'society', 'human', 'impact', 'trust', 'rights'],
                'AI Technology & Innovation': ['learning', 'model', 'algorithm', 'data', 'system', 'technology'],
                'AI Applications': ['healthcare', 'autonomous', 'driving', 'education', 'recommendation']
            }
            
            all_text_lower = ' '.join([doc['processed_text'] for doc in self.processed_docs]).lower()
            
            for area, terms in policy_terms.items():
                count = sum(all_text_lower.count(term) for term in terms)
                if count > 50:  # Only include if significant presence
                    f.write(f"### {area}\n")
                    f.write(f"*Relevance score: {count} term occurrences*\n\n")
                    f.write(f"This area focuses on {', '.join(terms[:4])} and related concepts.\n\n")
            
            # Visualizations
            f.write("## Visualizations\n\n")
            f.write("The following visualizations are available in the `visualizations/` folder:\n\n")
            f.write("1. **Word Cloud** - Visual representation of most frequent terms\n")
            f.write("2. **Document Length Distribution** - Histogram of document sizes\n")
            f.write("3. **Top Words Chart** - Bar chart of 20 most common terms\n")
            f.write("4. **Topic Distribution** - Distribution of documents across topics\n\n")
            
            f.write("![Word Cloud](visualizations/wordcloud.png)\n\n")
            
            # Recommendations
            f.write("## Recommendations for Further Research\n\n")
            f.write("1. **Deep Dive into Specific Topics** - Use the topic assignments to cluster related research\n")
            f.write("2. **Citation Network Analysis** - Map relationships between publications\n")
            f.write("3. **Temporal Analysis** - Track evolution of themes over time\n")
            f.write("4. **Policy Gap Analysis** - Identify under-researched policy areas\n")
            f.write("5. **Stakeholder Mapping** - Analyze author networks and institutional affiliations\n\n")
            
            # Data Files
            f.write("## Available Data Files\n\n")
            f.write("- `data/extracted_texts.json` - Full text of all documents\n")
            f.write("- `data/corpus_statistics.json` - Detailed statistics\n")
            f.write("- `data/topic_assignments.csv` - Document-topic mappings (see below)\n\n")
            
            # Footer
            f.write("---\n\n")
            f.write("*This assessment was generated using state-of-the-art NLP techniques ")
            f.write("including BERTopic and transformer-based models.*\n")
        
        # Save topic assignments as CSV
        if self.processed_docs and 'topic' in self.processed_docs[0]:
            df = pd.DataFrame([
                {
                    'filename': doc['filename'],
                    'topic': doc.get('topic', -1),
                    'word_count': doc['word_count']
                }
                for doc in self.processed_docs
            ])
            df.to_csv(self.output_folder / "data" / "topic_assignments.csv", index=False)
        
        print(f"\n✅ Report saved to: {report_path}")
        return report_path


def main():
    """Main execution function."""
    print("="*70)
    print("AI-POWERED LITERATURE LANDSCAPE ANALYSIS")
    print("HUMAINT Publications - Public Policy Assessment")
    print("="*70)
    
    # Check if PDFs exist
    if not Path(PDF_FOLDER).exists():
        print(f"\n[ERROR] PDF folder '{PDF_FOLDER}' not found!")
        return
    
    pdf_count = len(list(Path(PDF_FOLDER).glob("*.pdf")))
    if pdf_count == 0:
        print(f"\n[ERROR] No PDFs found in '{PDF_FOLDER}'!")
        return
    
    print(f"\nFound {pdf_count} PDF files")
    
    # Initialize analyzer
    analyzer = LandscapeAnalyzer(PDF_FOLDER, OUTPUT_FOLDER)
    
    # Step 1: Extract texts
    print("\n" + "="*70)
    print("STEP 1: TEXT EXTRACTION")
    print("="*70)
    documents = analyzer.extract_texts()
    
    if not documents:
        print("\n[ERROR] Could not extract text from any PDFs!")
        return
    
    # Step 2: Preprocess
    print("\n" + "="*70)
    print("STEP 2: TEXT PREPROCESSING")
    print("="*70)
    analyzer.preprocess_texts()
    
    # Step 3: Statistics
    print("\n" + "="*70)
    print("STEP 3: STATISTICAL ANALYSIS")
    print("="*70)
    stats = analyzer.generate_statistics()
    
    print(f"\nCorpus Statistics:")
    print(f"  - Total documents: {stats['total_documents']}")
    print(f"  - Total words: {stats['total_words']:,}")
    print(f"  - Unique words: {stats['unique_words']:,}")
    print(f"  - Avg words/document: {stats['avg_words_per_doc']:.0f}")
    
    # Step 4: Topic Modeling
    print("\n" + "="*70)
    print("STEP 4: TOPIC MODELING")
    print("="*70)
    analyzer.perform_topic_modeling(n_topics=8)
    
    # Step 5: Visualizations
    print("\n" + "="*70)
    print("STEP 5: VISUALIZATIONS")
    print("="*70)
    analyzer.create_visualizations(stats)
    
    # Step 6: Generate Report
    print("\n" + "="*70)
    print("STEP 6: LANDSCAPE ASSESSMENT REPORT")
    print("="*70)
    report_path = analyzer.generate_report(stats)
    
    # Summary
    print("\n" + "="*70)
    print("[SUCCESS] ANALYSIS COMPLETE!")
    print("="*70)
    print(f"\nAll outputs saved to: {OUTPUT_FOLDER}/")
    print(f"\nMain report: {report_path}")
    print(f"\nVisualizations: {OUTPUT_FOLDER}/visualizations/")
    print(f"\nData files: {OUTPUT_FOLDER}/data/")
    print("\nReady for public policy analysis!")


if __name__ == "__main__":
    main()
