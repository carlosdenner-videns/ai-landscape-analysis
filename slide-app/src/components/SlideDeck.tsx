import { useState, useEffect, useCallback } from 'react';
import { Deck, Language, MediaItem } from '../types';
import { Slide } from './Slide';
import { ProgressBar } from './ProgressBar';

/**
 * Props for SlideDeck component
 */
interface SlideDeckProps {
  deck: Deck;
  language: Language;
}

/**
 * SlideDeck component that manages slide navigation and keyboard controls
 * Persists current slide in sessionStorage and preloads next slide media
 */
export function SlideDeck({ deck, language }: SlideDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(() => {
    const stored = sessionStorage.getItem('currentSlide');
    return stored ? parseInt(stored, 10) : 0;
  });
  const [showNotes, setShowNotes] = useState(false);
  const [showProgressBar, setShowProgressBar] = useState(true);
  
  // Load segments with persisted order and deletions
  const [segments, setSegments] = useState(() => {
    const storageKey = `slideOrder_${language}`;
    const stored = localStorage.getItem(storageKey);
    
    if (stored) {
      try {
        const { order, deletedIds } = JSON.parse(stored);
        const filteredSegments = deck.segments.filter((seg: any) => !deletedIds.includes(seg.id));
        const orderedSegments = order
          .map((id: string) => filteredSegments.find((seg: any) => seg.id === id))
          .filter(Boolean);
        return orderedSegments.length > 0 ? orderedSegments : deck.segments;
      } catch {
        return deck.segments;
      }
    }
    return deck.segments;
  });

  // Update segments when deck changes (e.g., language change)
  useEffect(() => {
    const storageKey = `slideOrder_${language}`;
    const stored = localStorage.getItem(storageKey);
    
    if (stored) {
      try {
        const { order, deletedIds } = JSON.parse(stored);
        const filteredSegments = deck.segments.filter((seg: any) => !deletedIds.includes(seg.id));
        const orderedSegments = order
          .map((id: string) => filteredSegments.find((seg: any) => seg.id === id))
          .filter(Boolean);
        setSegments(orderedSegments.length > 0 ? orderedSegments : deck.segments);
      } catch {
        setSegments(deck.segments);
      }
    } else {
      setSegments(deck.segments);
    }
  }, [deck.segments, language]);

  useEffect(() => {
    sessionStorage.setItem('currentSlide', currentIndex.toString());
  }, [currentIndex]);

  // Preload next slide images
  useEffect(() => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < segments.length) {
      const nextSegment = segments[nextIndex];
      nextSegment.media.forEach((media: MediaItem) => {
        if (media.type === 'image') {
          const img = new Image();
          img.src = media.src;
        }
      });
    }
  }, [currentIndex, segments]);

  const navigate = useCallback(
    (index: number) => {
      if (index >= 0 && index < segments.length) {
        setCurrentIndex(index);
      }
    },
    [segments.length]
  );

  // Save current state to localStorage
  const saveToStorage = useCallback((newSegments: typeof segments) => {
    const storageKey = `slideOrder_${language}`;
    const order = newSegments.map((seg: any) => seg.id);
    const allIds = deck.segments.map((seg: any) => seg.id);
    const deletedIds = allIds.filter((id: string) => !order.includes(id));
    localStorage.setItem(storageKey, JSON.stringify({ order, deletedIds }));
  }, [language, deck.segments]);

  const handleReorder = useCallback(
    (fromIndex: number, toIndex: number) => {
      const newSegments = [...segments];
      const [movedSegment] = newSegments.splice(fromIndex, 1);
      newSegments.splice(toIndex, 0, movedSegment);
      setSegments(newSegments);
      saveToStorage(newSegments);
      
      // Adjust current index if needed
      if (currentIndex === fromIndex) {
        setCurrentIndex(toIndex);
      } else if (fromIndex < currentIndex && toIndex >= currentIndex) {
        setCurrentIndex(currentIndex - 1);
      } else if (fromIndex > currentIndex && toIndex <= currentIndex) {
        setCurrentIndex(currentIndex + 1);
      }
    },
    [segments, currentIndex, saveToStorage]
  );

  const handleDelete = useCallback(
    (index: number) => {
      if (segments.length <= 1) return;
      
      const newSegments = segments.filter((_: any, i: number) => i !== index);
      setSegments(newSegments);
      saveToStorage(newSegments);
      
      // Adjust current index if needed
      if (currentIndex >= newSegments.length) {
        setCurrentIndex(newSegments.length - 1);
      } else if (index < currentIndex) {
        setCurrentIndex(currentIndex - 1);
      }
    },
    [segments, currentIndex, saveToStorage]
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
    navigate(segments.length - 1);
  }, [segments.length, navigate]);

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
        case 'b':
        case 'B':
          e.preventDefault();
          setShowProgressBar((prev) => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, goToFirst, goToLast]);

  const currentSegment = segments[currentIndex];

  return (
    <div className="h-screen flex flex-col">
      {showProgressBar && (
        <ProgressBar 
          currentIndex={currentIndex} 
          total={segments.length} 
          onNavigate={navigate}
          onReorder={handleReorder}
          onDelete={handleDelete}
        />
      )}

      <main className="flex-1 pt-14 overflow-hidden" role="main">
        <Slide 
          segment={currentSegment} 
          showNotes={showNotes} 
          language={language}
        />
      </main>

      {/* Navigation Controls */}
      <nav
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg px-4 py-2 z-40"
        aria-label="Slide navigation"
      >
        <button
          onClick={prevSlide}
          disabled={currentIndex === 0}
          className="px-4 py-2 bg-primary-500 text-white rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
          aria-label="Previous slide"
        >
          ← Previous
        </button>

        <span className="text-gray-700 dark:text-gray-300 font-medium text-sm">
          {currentIndex + 1} / {deck.segments.length}
        </span>

        <button
          onClick={nextSlide}
          disabled={currentIndex === deck.segments.length - 1}
          className="px-4 py-2 bg-primary-500 text-white rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
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
          <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">T</kbd> Theme |{' '}
          <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">B</kbd> Bar |{' '}
          <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">C</kbd> Captions
        </p>
      </div>
    </div>
  );
}
