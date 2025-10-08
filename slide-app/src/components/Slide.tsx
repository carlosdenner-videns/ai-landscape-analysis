import { useState } from 'react';
import { Segment } from '../types';
import { MediaPlayer } from './MediaPlayer';
import { TitleSlide } from './TitleSlide';

/**
 * Props for Slide component
 */
interface SlideProps {
  segment: Segment;
  showNotes: boolean;
}

/**
 * Slide component that displays a single segment
 * Includes title, subtitle, bullets, media gallery, engagement prompt, and citations
 */
export function Slide({ segment, showNotes }: SlideProps) {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Check if this is a title slide
  const isTitle = (segment as any).isTitle;
  if (isTitle) {
    return <TitleSlide segment={segment as any} showNotes={showNotes} />;
  }

  // Text-to-speech function for reading notes in Spanish
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
    
    // Set Spanish voice
    utterance.lang = 'es-ES';
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1;
    utterance.volume = 1;

    // Try to use a Spanish voice if available
    const voices = window.speechSynthesis.getVoices();
    const spanishVoice = voices.find(voice => 
      voice.lang.startsWith('es-') || voice.lang === 'es'
    );
    if (spanishVoice) {
      utterance.voice = spanishVoice;
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

  return (
    <div className="h-full flex flex-col px-safe py-safe overflow-y-auto">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
          {segment.title}
        </h1>
        {segment.subtitle && (
          <h2 className="text-2xl md:text-3xl text-gray-600 dark:text-gray-300 leading-projector">
            {segment.subtitle}
          </h2>
        )}
      </header>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
        {/* Left Column: Bullets and Engagement */}
        <div className="space-y-6">
          {segment.bullets.length > 0 && (
            <ul className="space-y-4" role="list">
              {segment.bullets.map((bullet, index) => (
                <li
                  key={index}
                  className="text-xl md:text-2xl text-gray-700 dark:text-gray-200 leading-projector animate-fadeIn"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <span className="inline-block w-3 h-3 bg-primary-500 rounded-full mr-4" />
                  {bullet}
                </li>
              ))}
            </ul>
          )}

          {segment.engagement && (
            <div className="mt-8 p-6 bg-primary-50 dark:bg-primary-900/20 rounded-lg border-l-4 border-primary-500">
              <p className="text-lg md:text-xl font-semibold text-primary-900 dark:text-primary-100 mb-2">
                💭 Think About This
              </p>
              <p className="text-lg md:text-xl text-primary-800 dark:text-primary-200">
                {segment.engagement.prompt}
              </p>
            </div>
          )}

        </div>

        {/* Right Column: Media */}
        {segment.media.length > 0 && (
          <div className="flex flex-col items-center justify-center">
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
        )}
      </div>

      {/* Speaker Notes Overlay with Text-to-Speech */}
      {showNotes && segment.notes && (
        <div className="fixed bottom-0 left-0 right-0 bg-yellow-100 dark:bg-yellow-900 border-t-4 border-yellow-500 p-4 shadow-lg z-50">
          <div className="flex items-start justify-between gap-4">
            <p className="text-sm md:text-base text-yellow-900 dark:text-yellow-100 flex-1">
              <strong>📝 Notes:</strong> {segment.notes}
            </p>
            <button
              onClick={speakNotes}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                isSpeaking 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-videns-primary hover:bg-videns-secondary text-white'
              }`}
              aria-label={isSpeaking ? 'Detener lectura' : 'Leer notas en español'}
            >
              {isSpeaking ? (
                <>
                  <span>⏸️</span>
                  <span>Stop</span>
                </>
              ) : (
                <>
                  <span>🔊</span>
                  <span>Read ES</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Citations section - simplified for now */}
      {segment.citations && segment.citations.length > 0 && (
        <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <h4 className="font-semibold mb-2">Referencias:</h4>
          <ul className="space-y-1 text-sm">
            {segment.citations.map((citation, index) => (
              <li key={index}>
                <a href={citation.url} target="_blank" rel="noopener noreferrer" 
                   className="text-primary-600 hover:text-primary-800 underline">
                  {citation.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
