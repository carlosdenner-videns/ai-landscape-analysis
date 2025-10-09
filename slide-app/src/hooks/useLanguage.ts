import { useState, useEffect } from 'react';
import { Language } from '../types';

/**
 * Hook for managing language state with localStorage persistence
 */
export function useLanguage(): [Language, (lang: Language) => void] {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem('language');
    return (stored as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  return [language, setLanguageState];
}
