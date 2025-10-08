import { useState, useEffect, useCallback } from 'react';
import { Deck } from '../types';
import { Slide } from './Slide';
import { ProgressBar } from './ProgressBar';

/**
 * Props for SlideDeck component
 */
interface SlideDeckProps {
  deck: Deck;
}

/**
 * SlideDeck component that manages slide navigation and keyboard controls
 * Persists current slide in sessionStorage and preloads next slide media
 */
export function SlideDeck({ deck }: SlideDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(() => {
    const stored = sessionStorage.getItem('currentSlide');
    return stored ? parseInt(stored, 10) : 0;
  });
  const [showNotes, setShowNotes] = useState(false);

  useEffect(() => {
    sessionStorage.setItem('currentSlide', currentIndex.toString());
  }, [currentIndex]);

  // Preload next slide images
  useEffect(() => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < deck.segments.length) {
      const nextSegment = deck.segments[nextIndex];
      nextSegment.media.forEach((media) => {
        if (media.type === 'image') {
          const img = new Image();
          img.src = media.src;
        }
      });
    }
  }, [currentIndex, deck.segments]);

  const navigate = useCallback(
    (index: number) => {
      if (index >= 0 && index < deck.segments.length) {
        setCurrentIndex(index);
      }
    },
    [deck.segments.length]
  );

  const nextSlide = useCallback(() => {
    navigate(currentIndex + 1);
  }, [currentIndex, navigate]);

  const prevSlide = useCallback(() => {
    navigate(currentIndex - 1);
  }, [currentIndex, navigate]);

  const goToFirst = useCallback(() => {
    navigate(0);
  }, [navigate]);

  const goToLast = useCallback(() => {
    navigate(deck.segments.length - 1);
  }, [deck.segments.length, navigate]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
          e.preventDefault();
          nextSlide();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          prevSlide();
          break;
        case 'Home':
          e.preventDefault();
          goToFirst();
          break;
        case 'End':
          e.preventDefault();
          goToLast();
          break;
        case 'p':
        case 'P':
          e.preventDefault();
          setShowNotes((prev) => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, goToFirst, goToLast]);

  const currentSegment = deck.segments[currentIndex];

  return (
    <div className="h-screen flex flex-col">
      <ProgressBar currentIndex={currentIndex} total={deck.segments.length} onNavigate={navigate} />

      <main className="flex-1 pt-16 overflow-hidden" role="main">
        <Slide segment={currentSegment} showNotes={showNotes} />
      </main>

      {/* Navigation Controls */}
      <nav
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg px-6 py-3 z-40"
        aria-label="Slide navigation"
      >
        <button
          onClick={prevSlide}
          disabled={currentIndex === 0}
          className="px-6 py-3 bg-primary-500 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
          aria-label="Previous slide"
        >
          ← Previous
        </button>

        <span className="text-gray-700 dark:text-gray-300 font-medium">
          {currentIndex + 1} / {deck.segments.length}
        </span>

        <button
          onClick={nextSlide}
          disabled={currentIndex === deck.segments.length - 1}
          className="px-6 py-3 bg-primary-500 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
          aria-label="Next slide"
        >
          Next →
        </button>
      </nav>

      {/* Keyboard Shortcuts Help */}
      <div className="fixed bottom-4 right-4 text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-lg shadow px-3 py-2 z-40">
        <p>
          <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">←→</kbd> Navigate |{' '}
          <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">P</kbd> Notes |{' '}
          <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">T</kbd> Theme
        </p>
      </div>
    </div>
  );
}
