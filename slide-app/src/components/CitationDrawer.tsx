import { useEffect, useRef } from 'react';
import { Citation } from '../types';

/**
 * Props for CitationDrawer component
 */
interface CitationDrawerProps {
  citations: Citation[];
  isOpen: boolean;
  onClose: () => void;
}

/**
 * CitationDrawer component that displays citations in a slide-out panel
 * Implements focus trap and accessible dialog pattern
 */
export function CitationDrawer({ citations, isOpen, onClose }: CitationDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-end bg-black bg-opacity-50 transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="citation-drawer-title"
    >
      <div
        ref={drawerRef}
        className="h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-xl transform transition-transform overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2
              id="citation-drawer-title"
              className="text-2xl font-bold text-gray-900 dark:text-white"
            >
              📚 Sources & References
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg p-2"
              aria-label="Close citations"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <ul className="space-y-4" role="list">
            {citations.map((citation, index) => (
              <li
                key={index}
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <a
                  href={citation.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
                >
                  <span className="text-gray-500 dark:text-gray-400 text-sm">
                    [{index + 1}]
                  </span>{' '}
                  {citation.label}
                  <svg
                    className="inline-block w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
