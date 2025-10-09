import { useState, useEffect, useRef } from 'react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { translateText, debounce } from '../utils/translation';

/**
 * Props for LiveCaptionBar component
 */
interface LiveCaptionBarProps {
  showOriginal?: boolean; // Show original transcript alongside translation
}

/**
 * LiveCaptionBar Component
 * Displays real-time speech transcription and translation in a discrete footer
 */
export function LiveCaptionBar({
  showOriginal = true,
}: LiveCaptionBarProps) {
  const [sourceLanguage, setSourceLanguage] = useState<string>('en-US');
  const [targetLanguage, setTargetLanguage] = useState<'es' | 'pt' | 'fr'>('es');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [lastTranscript, setLastTranscript] = useState('');
  
  const {
    transcript,
    isListening,
    isSupported,
    error,
    toggleListening,
    results,
  } = useSpeechRecognition({
    language: sourceLanguage,
    continuous: true,
    interimResults: true,
  });

  // Ref to track if we've shown the unsupported warning
  const hasShownWarning = useRef(false);

  // Language labels for UI
  const targetLanguageLabels: Record<string, string> = {
    'es': '🇪🇸 Español',
    'pt': '🇧🇷 Português',
    'fr': '🇫🇷 Français',
  };

  // Source language options
  const sourceLanguageOptions: Array<{ code: string; label: string }> = [
    { code: 'en-US', label: '🇺🇸 English' },
    { code: 'pt-BR', label: '🇧🇷 Português' },
    { code: 'es-ES', label: '🇪🇸 Español' },
    { code: 'fr-FR', label: '🇫🇷 Français' },
  ];

  // Target language options
  const targetLanguageOptions: Array<{ code: 'es' | 'pt' | 'fr'; label: string }> = [
    { code: 'es', label: '🇪🇸 Español' },
    { code: 'pt', label: '🇧🇷 Português' },
    { code: 'fr', label: '🇫🇷 Français' },
  ];

  // Debounced translation function
  const debouncedTranslate = useRef(
    debounce(async (text: string) => {
      if (!text || text.trim().length === 0) {
        setTranslatedText('');
        return;
      }

      setIsTranslating(true);
      try {
        // Extract language code from sourceLanguage (e.g., 'en-US' -> 'en')
        const sourceLangCode = sourceLanguage.split('-')[0];
        const translated = await translateText(text, sourceLangCode, targetLanguage);
        setTranslatedText(translated);
      } catch (err) {
        console.error('Translation error:', err);
      } finally {
        setIsTranslating(false);
      }
    }, 1500) // Wait 1.5s after speech stops before translating
  ).current;

  // Clear transcript and translation when source or target language changes
  useEffect(() => {
    setTranslatedText('');
    setLastTranscript('');
  }, [sourceLanguage, targetLanguage]);

  // Monitor transcript changes and trigger translation
  useEffect(() => {
    // Only translate final results (not interim ones)
    const finalResults = results.filter(r => r.isFinal);
    if (finalResults.length > 0) {
      const latestFinal = finalResults[finalResults.length - 1];
      
      // Only translate if we have new content
      if (latestFinal.transcript !== lastTranscript) {
        setLastTranscript(latestFinal.transcript);
        debouncedTranslate(latestFinal.transcript);
      }
    }
  }, [results, lastTranscript, debouncedTranslate]);

  // Show browser compatibility warning
  useEffect(() => {
    if (!isSupported && !hasShownWarning.current) {
      hasShownWarning.current = true;
      alert('Live captions require Chrome or Edge browser. Please switch browsers to use this feature.');
    }
  }, [isSupported]);

  // Don't render if not supported
  if (!isSupported) {
    return null;
  }

  // Get the most recent transcript (final or interim)
  const displayTranscript = transcript || 'Waiting for speech...';
  const displayTranslation = translatedText || (isTranslating ? 'Translating...' : 'Translation will appear here');

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 pointer-events-none">
      {/* Caption bar - positioned above navigation buttons */}
      <div className={`
        transition-all duration-300 ease-in-out pointer-events-auto
        ${isListening ? 'mb-20' : 'mb-0'}
      `}>
        <div className={`
          ${isListening ? 'bg-black/90 backdrop-blur-md' : 'bg-gray-800/80 backdrop-blur-sm'}
          border-t-2 ${isListening ? 'border-green-500' : 'border-gray-600'}
          shadow-2xl
        `}>
          <div className="max-w-7xl mx-auto px-6 py-2">
            {/* Controls row - compact */}
            <div className="flex items-center justify-between">
              {/* Left side: Toggle button and status */}
              <div className="flex items-center space-x-3">
                {/* Toggle button */}
                <button
                  onClick={toggleListening}
                  className={`
                    flex items-center space-x-2 px-3 py-1.5 rounded-lg font-medium text-sm
                    transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2
                    ${isListening 
                      ? 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500' 
                      : 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500'
                    }
                  `}
                  aria-label={isListening ? 'Stop live captions' : 'Start live captions'}
                >
                  <span className="text-base">
                    {isListening ? '⏹️' : '🎤'}
                  </span>
                  <span className="text-xs font-semibold">
                    {isListening ? 'Stop Captions' : 'Live Captions'}
                  </span>
                </button>

                {/* Status indicator */}
                {isListening && (
                  <div className="flex items-center space-x-2 text-green-400">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium">Recording</span>
                  </div>
                )}
              </div>

              {/* Right side: Language selectors */}
              <div className="flex items-center space-x-4">
                {/* Source language selector */}
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400 text-xs font-medium">From:</span>
                  <select
                    value={sourceLanguage}
                    onChange={(e) => setSourceLanguage(e.target.value)}
                    className="bg-gray-700 text-white text-xs rounded px-2 py-1 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-videns-500 cursor-pointer"
                    aria-label="Select source language"
                  >
                    {sourceLanguageOptions.map(option => (
                      <option key={option.code} value={option.code}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Arrow indicator */}
                <span className="text-gray-500 text-xs">→</span>

                {/* Target language selector */}
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400 text-xs font-medium">To:</span>
                  <select
                    value={targetLanguage}
                    onChange={(e) => setTargetLanguage(e.target.value as 'es' | 'pt' | 'fr')}
                    className="bg-gray-700 text-white text-xs rounded px-2 py-1 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-videns-500 cursor-pointer"
                    aria-label="Select target language"
                  >
                    {targetLanguageOptions.map(option => (
                      <option key={option.code} value={option.code}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Captions row - large single box for translation */}
            {isListening && (
              <div className="mt-2">
                {/* Show original if enabled (compact) */}
                {showOriginal && (
                  <div className="bg-gray-900/50 rounded-lg px-3 py-1.5 mb-2 border border-gray-700">
                    <p className="text-white text-sm leading-relaxed">
                      <span className="text-blue-400 font-semibold mr-2">
                        {sourceLanguageOptions.find(opt => opt.code === sourceLanguage)?.label.split(' ')[0]}
                      </span>
                      {displayTranscript}
                    </p>
                  </div>
                )}

                {/* Translated text - LARGE and prominent */}
                <div className="bg-gradient-to-r from-videns-600 to-videns-700 rounded-lg px-4 py-3 border-2 border-videns-400 shadow-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-yellow-300 uppercase tracking-wide">
                      ✨ {targetLanguageLabels[targetLanguage]}
                    </span>
                    {isTranslating && (
                      <span className="text-xs text-yellow-200 italic animate-pulse">
                        Translating...
                      </span>
                    )}
                  </div>
                  <p className="text-white text-lg md:text-xl leading-relaxed font-medium min-h-[3rem]">
                    {displayTranslation}
                  </p>
                </div>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="mt-2 bg-red-900/50 border border-red-500 rounded-lg px-3 py-2">
                <div className="flex items-center space-x-2">
                  <span className="text-red-400">⚠️</span>
                  <p className="text-red-200 text-xs">{error}</p>
                </div>
              </div>
            )}

            {/* Help text when not listening - compact */}
            {!isListening && (
              <div className="text-center text-gray-400 text-xs py-1">
                <p>💡 Click to enable real-time transcription & translation (Chrome/Edge only)</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
