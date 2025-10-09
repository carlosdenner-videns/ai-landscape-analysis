import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Speech Recognition types (extends Window interface)
 */
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
  timestamp: number;
}

export interface UseSpeechRecognitionOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
}

export interface UseSpeechRecognitionReturn {
  transcript: string;
  isListening: boolean;
  isSupported: boolean;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
  toggleListening: () => void;
  results: SpeechRecognitionResult[];
}

/**
 * Custom hook for Web Speech API
 * Provides real-time speech-to-text transcription
 */
export function useSpeechRecognition(
  options: UseSpeechRecognitionOptions = {}
): UseSpeechRecognitionReturn {
  const {
    language = 'en-US',
    continuous = true,
    interimResults = true,
  } = options;

  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<SpeechRecognitionResult[]>([]);
  
  const recognitionRef = useRef<any>(null);
  const shouldRestartRef = useRef(false); // Track if we should auto-restart
  const isSupported = useRef(
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
  ).current;

  // Initialize speech recognition
  useEffect(() => {
    if (!isSupported) {
      setError('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = continuous;
    recognition.interimResults = interimResults;
    recognition.lang = language;
    recognition.maxAlternatives = 1;

    // Handle results
    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';
      const newResults: SpeechRecognitionResult[] = [];

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;
        const confidence = result[0].confidence;

        newResults.push({
          transcript,
          confidence,
          isFinal: result.isFinal,
          timestamp: Date.now(),
        });

        if (result.isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      setResults(prev => [...prev, ...newResults]);
      setTranscript(prev => prev + finalTranscript + interimTranscript);
      setError(null);
    };

    // Handle errors
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      
      if (event.error === 'no-speech') {
        // Don't show error for no-speech, just continue listening
        // Recognition will auto-restart via onend handler
        return;
      }
      
      if (event.error === 'audio-capture') {
        setError('No microphone detected. Please check your microphone connection.');
        shouldRestartRef.current = false;
      } else if (event.error === 'not-allowed') {
        setError('Microphone access denied. Please grant permission to use the microphone.');
        setIsListening(false);
        shouldRestartRef.current = false;
      } else if (event.error === 'network') {
        setError('Network error. Please check your internet connection.');
      } else {
        setError(`Speech recognition error: ${event.error}`);
      }
    };

    // Handle end event - auto-restart if needed
    recognition.onend = () => {
      setIsListening(false);
      
      // Auto-restart if user wants to keep listening
      if (shouldRestartRef.current) {
        setTimeout(() => {
          try {
            if (recognitionRef.current && shouldRestartRef.current) {
              recognitionRef.current.start();
            }
          } catch (err) {
            console.error('Error restarting recognition:', err);
            shouldRestartRef.current = false;
          }
        }, 100); // Small delay before restart
      }
    };

    // Handle start event
    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isSupported, language, continuous, interimResults]);

  // Start listening
  const startListening = useCallback(() => {
    if (!isSupported) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }

    if (recognitionRef.current && !isListening) {
      try {
        setTranscript('');
        setResults([]);
        setError(null);
        shouldRestartRef.current = true; // Enable auto-restart
        recognitionRef.current.start();
      } catch (err) {
        console.error('Error starting recognition:', err);
        setError('Failed to start speech recognition');
        shouldRestartRef.current = false;
      }
    }
  }, [isSupported, isListening]);

  // Stop listening
  const stopListening = useCallback(() => {
    shouldRestartRef.current = false; // Disable auto-restart
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  // Toggle listening
  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    transcript,
    isListening,
    isSupported,
    error,
    startListening,
    stopListening,
    toggleListening,
    results,
  };
}
