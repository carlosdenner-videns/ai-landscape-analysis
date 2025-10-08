import { useState } from 'react';
import { Segment, Language } from '../types';

/**
 * Props for TitleSlide component
 */
interface TitleSlideProps {
  segment: Segment & {
    presenter?: {
      name: string;
      title: string;
      organization: string;
      date: string;
      conference: string;
    };
  };
  showNotes: boolean;
  language: Language;
}

/**
 * Professional title slide component for conference presentations
 * Features VIDENS branding, animations, and presenter information
 */
export function TitleSlide({ segment, showNotes, language }: TitleSlideProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Map language codes to speech synthesis language codes
  const languageMap: Record<Language, string> = {
    'en': 'en-US',
    'es': 'es-ES',
    'pt': 'pt-BR',
    'fr': 'fr-FR'
  };

  // Button text translations
  const buttonLabels: Record<Language, { play: string; stop: string }> = {
    'en': { play: 'Read Aloud', stop: 'Stop' },
    'es': { play: 'Leer en Español', stop: 'Detener' },
    'pt': { play: 'Ler em Português', stop: 'Parar' },
    'fr': { play: 'Lire en Français', stop: 'Arrêter' }
  };

  // Notes header translations
  const notesHeader: Record<Language, string> = {
    'en': '📝 Presenter Notes:',
    'es': '📝 Notas del Presentador:',
    'pt': '📝 Notas do Apresentador:',
    'fr': '📝 Notes du Présentateur:'
  };

  // Text-to-speech function for reading notes in selected language
  const speakNotes = () => {
    if (!segment.notes) return;

    // Stop if already speaking
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Create speech synthesis utterance
    const utterance = new SpeechSynthesisUtterance(segment.notes);
    
    // Set voice based on selected language
    const speechLang = languageMap[language];
    utterance.lang = speechLang;
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1;
    utterance.volume = 1;

    // Try to use a voice for the selected language if available
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(voice => 
      voice.lang.startsWith(language + '-') || voice.lang === language
    );
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    // Handle events
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    // Speak
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="h-full relative title-slide overflow-hidden">
      {/* Animated AI dots */}
      <div className="ai-dots animate-floatingDots"></div>
      <div className="ai-dots animate-floatingDots"></div>
      <div className="ai-dots animate-floatingDots"></div>
      <div className="ai-dots animate-floatingDots"></div>
      <div className="ai-dots animate-floatingDots"></div>

      {/* Main content container */}
      <div className="h-full flex flex-col justify-center items-center px-safe py-safe text-center relative z-10">
        
        {/* Top header with logos and date - below language selector */}
        <div className="absolute top-20 left-0 right-0 flex items-start justify-between px-8 pt-4">
          
          {/* VIDENS branding - left side */}
          <div className="animate-slideInLeft">
            <a 
              href="https://www.google.com/search?q=Videns+AI" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity cursor-pointer group"
              aria-label="Search Google for Videns AI"
            >
              <div className="w-10 h-10 bg-videns-primary rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                <div className="w-5 h-5 bg-white rounded-sm animate-aiPulse"></div>
              </div>
              <span className="text-videns-secondary font-bold text-2xl group-hover:text-videns-primary transition-colors">VIDENS</span>
            </a>
          </div>

          {/* Center - Date */}
          <div className="animate-fadeIn" style={{ animationDelay: '0.3s', opacity: 0 }}>
            <div className="text-center">
              <span className="text-videns-secondary font-medium text-lg">
                {segment.presenter?.date || '14 de agosto, 2025'}
              </span>
            </div>
          </div>

          {/* ESAP Logo - right side (below language selector) */}
          <div className="animate-slideInRight">
            <div className="flex flex-col items-center">
              <div className="relative w-20 h-20 mb-1">
                {/* ESAP Logo - Pyramid of circles */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  {/* Top circle */}
                  <div className="w-4 h-4 bg-blue-600 rounded-full mb-0.5"></div>
                  {/* Second row - 2 circles */}
                  <div className="flex space-x-1 mb-0.5">
                    <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                    <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                  </div>
                  {/* Third row - 3 circles */}
                  <div className="flex space-x-1 mb-0.5">
                    <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                    <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                    <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                  </div>
                  {/* Bottom row - 4 circles with letters */}
                  <div className="flex space-x-1">
                    <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center text-white text-[9px] font-bold">E</div>
                    <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center text-white text-[9px] font-bold">S</div>
                    <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center text-white text-[9px] font-bold">A</div>
                    <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center text-white text-[9px] font-bold">P</div>
                  </div>
                </div>
              </div>
              <span className="text-blue-600 font-bold text-xs">ESAP</span>
            </div>
          </div>

        </div>

        {/* Main title section */}
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Main title */}
          <div className="animate-fadeIn" style={{ animationDelay: '0.5s', opacity: 0 }}>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-videns-secondary leading-tight mb-6">
              {segment.title}
            </h1>
            <h2 className="text-2xl md:text-3xl lg:text-4xl text-videns-700 leading-relaxed font-light">
              {segment.subtitle}
            </h2>
          </div>

          {/* Key Topics - Visual Grid */}
          <div className="animate-fadeIn max-w-5xl mx-auto" style={{ animationDelay: '1s', opacity: 0 }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {(segment as any).dimensions?.map((dimension: any, index: number) => {
                const animationClass = index === 0 ? 'animate-slideInLeft' : index === 2 ? 'animate-slideInRight' : 'animate-fadeIn';
                const delay = 1.2 + (index * 0.2);
                
                return (
                  <div 
                    key={index}
                    className={`bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-videns-200 dark:border-videns-700 hover:scale-105 transition-transform ${animationClass}`} 
                    style={{ animationDelay: `${delay}s`, opacity: 0 }}
                  >
                    <div className="text-4xl mb-4">{dimension.icon}</div>
                    <h3 className="text-xl font-bold text-videns-secondary dark:text-videns-300 mb-2">{dimension.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">{dimension.description}</p>
                  </div>
                );
              })}
            </div>

            {/* Key Message */}
            {(segment as any).keyMessage && (
              <div className="bg-gradient-to-r from-videns-500 to-videns-600 text-white rounded-xl p-6 shadow-xl animate-fadeIn" style={{ animationDelay: '1.8s', opacity: 0 }}>
                <p className="text-2xl font-light italic">
                  "{(segment as any).keyMessage}"
                </p>
              </div>
            )}
          </div>

          {/* Presenter information */}
          {segment.presenter && (
            <div className="animate-fadeIn" style={{ animationDelay: '2.5s', opacity: 0 }}>
              <div className="bg-videns-50/90 dark:bg-gray-700/90 backdrop-blur-sm rounded-xl p-6 shadow-md border border-videns-200 dark:border-videns-600">
                <h3 className="text-2xl font-bold text-videns-secondary dark:text-videns-300 mb-2">
                  {segment.presenter.name}
                </h3>
                <p className="text-videns-700 dark:text-videns-200 text-lg">
                  {segment.presenter.title}
                </p>
                <p className="text-videns-600 dark:text-videns-300 font-medium">
                  {segment.presenter.organization}
                </p>
                {segment.presenter.conference && (
                  <p className="text-videns-500 dark:text-videns-400 text-sm mt-2 italic">
                    {segment.presenter.conference}
                  </p>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Subtle AI-themed decoration */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-fadeIn" style={{ animationDelay: '3s', opacity: 0 }}>
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-videns-accent rounded-full animate-aiPulse" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-videns-accent rounded-full animate-aiPulse" style={{ animationDelay: '0.3s' }}></div>
            <div className="w-2 h-2 bg-videns-accent rounded-full animate-aiPulse" style={{ animationDelay: '0.6s' }}></div>
          </div>
        </div>

      </div>

      {/* Speaker notes overlay with text-to-speech - always on top */}
      {showNotes && segment.notes && (
        <div className="fixed bottom-0 left-0 right-0 bg-black/95 text-white p-6 backdrop-blur-sm shadow-2xl border-t-4 border-yellow-400 z-[9999]">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-start justify-between gap-4 mb-3">
              <h4 className="font-bold text-yellow-400 text-lg">{notesHeader[language]}</h4>
              <button
                onClick={speakNotes}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                  isSpeaking 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-videns-primary hover:bg-videns-secondary'
                }`}
                aria-label={isSpeaking ? buttonLabels[language].stop : buttonLabels[language].play}
              >
                {isSpeaking ? (
                  <>
                    <span>⏸️</span>
                    <span>{buttonLabels[language].stop}</span>
                  </>
                ) : (
                  <>
                    <span>🔊</span>
                    <span>{buttonLabels[language].play}</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-base leading-relaxed">{segment.notes}</p>
          </div>
        </div>
      )}
    </div>
  );
}
