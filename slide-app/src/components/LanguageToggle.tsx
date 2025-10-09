import { Language } from '../types';

/**
 * Props for LanguageToggle component
 */
interface LanguageToggleProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
}

/**
 * LanguageToggle component for switching between EN/ES/PT/FR
 */
export function LanguageToggle({ currentLanguage, onLanguageChange }: LanguageToggleProps) {
  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'EN' },
    { code: 'es', label: 'ES' },
    { code: 'pt', label: 'PT' },
    { code: 'fr', label: 'FR' },
  ];

  return (
    <div
      className="fixed top-20 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 flex space-x-1 z-40"
      role="group"
      aria-label="Language selection"
    >
      {languages.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => onLanguageChange(code)}
          className={`px-4 py-2 rounded-md font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            currentLanguage === code
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          aria-label={`Switch to ${label}`}
          aria-pressed={currentLanguage === code}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
