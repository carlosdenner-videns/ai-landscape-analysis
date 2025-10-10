import { useState } from 'react';
import { Segment, Language } from '../types';
import { MediaPlayer } from './MediaPlayer';
import { TitleSlide } from './TitleSlide';
import { ContentSlide } from './ContentSlide';

/**
 * Props for Slide component
 */
interface SlideProps {
  segment: Segment;
  showNotes: boolean;
  language: Language;
}

/**
 * Slide component that displays a single segment
 * Includes title, subtitle, bullets, media gallery, engagement prompt, and citations
 */
export function Slide({ segment, showNotes, language }: SlideProps) {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Check if this is a title slide
  const isTitle = (segment as any).isTitle;
  if (isTitle) {
    return <TitleSlide segment={segment as any} showNotes={showNotes} language={language} />;
  }

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

  // Engagement prompt header translations
  const engagementHeader: Record<Language, string> = {
    'en': '💭 Think About This',
    'es': '💭 Piensa en Esto',
    'pt': '💭 Pense Nisso',
    'fr': '💭 Réfléchissez à Ceci'
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

  const hasMultipleMedia = segment.media.length > 1;
  const currentMedia = segment.media[currentMediaIndex];

  const nextMedia = () => {
    setCurrentMediaIndex((prev) => (prev + 1) % segment.media.length);
  };

  const prevMedia = () => {
    setCurrentMediaIndex((prev) => (prev - 1 + segment.media.length) % segment.media.length);
  };

  // Left column content: bullets
  const leftContent = (
    <div className="h-full flex flex-col justify-center">
      {segment.bullets.length > 0 && (
        <ul className="space-y-5" role="list">
          {segment.bullets.map((bullet, index) => (
            <li
              key={index}
              className="flex items-start text-lg md:text-xl lg:text-2xl text-gray-700 dark:text-gray-200 leading-relaxed animate-fadeIn"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <span className="inline-block w-3 h-3 bg-primary-500 rounded-full mr-4 mt-2 flex-shrink-0" />
              <span className="flex-1">{bullet}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  // Right column content: media
  const rightContent = segment.media.length > 0 ? (
    <div className="flex flex-col items-center justify-center w-full h-full">
      {currentMedia && <MediaPlayer media={currentMedia} />}

      {/* Media Navigation */}
      {hasMultipleMedia && (
        <div className="mt-4 flex items-center gap-4">
          <button
            onClick={prevMedia}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Previous media"
          >
            ← Prev
          </button>
          <span className="text-gray-700 dark:text-gray-300">
            {currentMediaIndex + 1} / {segment.media.length}
          </span>
          <button
            onClick={nextMedia}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Next media"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  ) : undefined;

  // Bottom content: engagement prompt
  const bottomContent = segment.engagement ? (
    <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border-l-4 border-primary-500">
      <p className="text-sm md:text-base font-semibold text-primary-900 dark:text-primary-100 mb-1">
        {engagementHeader[language]}
      </p>
      <p className="text-sm md:text-base text-primary-800 dark:text-primary-200 leading-snug">
        {segment.engagement.prompt}
      </p>
    </div>
  ) : undefined;

  return (
    <>
      <ContentSlide
        title={segment.title}
        subtitle={segment.subtitle}
        leftContent={leftContent}
        rightContent={rightContent}
        bottomContent={bottomContent}
      />

      {/* Speaker Notes Overlay with Text-to-Speech - Always on top */}
      {showNotes && segment.notes && (
        <div className="fixed bottom-0 left-0 right-0 bg-black/95 dark:bg-black/95 border-t-4 border-yellow-500 p-6 shadow-2xl backdrop-blur-sm z-[9999]">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1">
                <h4 className="font-bold text-yellow-400 text-lg mb-2">{notesHeader[language]}</h4>
                <p className="text-base text-white leading-relaxed">{segment.notes}</p>
              </div>
              <button
                onClick={speakNotes}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                  isSpeaking 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-videns-primary hover:bg-videns-secondary text-white'
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
          </div>
        </div>
      )}

    </>
  );
}
