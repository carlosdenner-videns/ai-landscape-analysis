/**
 * Props for ProgressBar component
 */
interface ProgressBarProps {
  currentIndex: number;
  total: number;
  onNavigate: (index: number) => void;
}

/**
 * ProgressBar component that shows segment progress
 * Allows clicking to jump to specific segments
 */
export function ProgressBar({ currentIndex, total, onNavigate }: ProgressBarProps) {
  return (
    <nav
      className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-md z-40"
      aria-label="Slide progress"
    >
      <div className="flex items-center justify-center h-16 px-4">
        <div className="flex items-center space-x-2">
          {Array.from({ length: total }, (_, i) => (
            <button
              key={i}
              onClick={() => onNavigate(i)}
              className={`w-10 h-10 rounded-full font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                i === currentIndex
                  ? 'bg-primary-500 text-white scale-110'
                  : i < currentIndex
                  ? 'bg-primary-200 dark:bg-primary-700 text-primary-900 dark:text-primary-100 hover:bg-primary-300 dark:hover:bg-primary-600'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === currentIndex ? 'true' : 'false'}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <span className="ml-4 text-sm text-gray-600 dark:text-gray-400">
          {currentIndex + 1} / {total}
        </span>
      </div>
    </nav>
  );
}
