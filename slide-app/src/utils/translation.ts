/**
 * Translation utilities for live captioning
 * Uses MyMemory Translation API (free, no API key required)
 */

interface TranslationCache {
  [key: string]: string;
}

// Simple in-memory cache to avoid redundant API calls
const translationCache: TranslationCache = {};

/**
 * Translates text from one language to another using MyMemory API
 * Falls back to original text if translation fails
 * 
 * @param text - Text to translate
 * @param sourceLang - Source language code (e.g., 'en')
 * @param targetLang - Target language code (e.g., 'es')
 * @returns Translated text or original text if translation fails
 */
export async function translateText(
  text: string,
  sourceLang: string = 'en',
  targetLang: string = 'es'
): Promise<string> {
  // Don't translate empty strings
  if (!text || text.trim().length === 0) {
    return text;
  }

  // Don't translate if source and target are the same
  if (sourceLang === targetLang) {
    return text;
  }

  // Check cache first
  const cacheKey = `${sourceLang}-${targetLang}-${text}`;
  if (translationCache[cacheKey]) {
    return translationCache[cacheKey];
  }

  try {
    // Use MyMemory Translation API (free, 1000 chars/request limit)
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.warn('Translation API request failed:', response.statusText);
      return text; // Return original text on error
    }

    const data = await response.json();
    
    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      const translated = data.responseData.translatedText;
      
      // Cache the result
      translationCache[cacheKey] = translated;
      
      return translated;
    } else {
      console.warn('Translation failed:', data);
      return text; // Return original text if translation failed
    }
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original text on error
  }
}

/**
 * Debounce function to limit API calls
 * 
 * @param func - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: number | undefined;
  
  return (...args: Parameters<T>) => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => func(...args), delay) as unknown as number;
  };
}

/**
 * Splits text into sentences for better translation
 * 
 * @param text - Text to split
 * @returns Array of sentences
 */
export function splitIntoSentences(text: string): string[] {
  // Simple sentence splitting (can be improved)
  return text
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

/**
 * Translates text in chunks to handle long transcripts
 * 
 * @param text - Text to translate
 * @param sourceLang - Source language code
 * @param targetLang - Target language code
 * @param maxChunkSize - Maximum characters per chunk
 * @returns Translated text
 */
export async function translateLongText(
  text: string,
  sourceLang: string = 'en',
  targetLang: string = 'es',
  maxChunkSize: number = 500
): Promise<string> {
  if (text.length <= maxChunkSize) {
    return translateText(text, sourceLang, targetLang);
  }

  // Split into sentences
  const sentences = splitIntoSentences(text);
  const chunks: string[] = [];
  let currentChunk = '';

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > maxChunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk);
      currentChunk = sentence;
    } else {
      currentChunk += (currentChunk ? '. ' : '') + sentence;
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  // Translate each chunk
  const translatedChunks = await Promise.all(
    chunks.map(chunk => translateText(chunk, sourceLang, targetLang))
  );

  return translatedChunks.join('. ');
}

/**
 * Clears the translation cache
 */
export function clearTranslationCache(): void {
  Object.keys(translationCache).forEach(key => delete translationCache[key]);
}
