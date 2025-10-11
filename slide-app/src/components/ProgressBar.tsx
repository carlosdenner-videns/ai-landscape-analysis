import { useState } from 'react';

/**
 * Props for ProgressBar component
 */
interface ProgressBarProps {
  currentIndex: number;
  total: number;
  onNavigate: (index: number) => void;
  onReorder?: (fromIndex: number, toIndex: number) => void;
  onDelete?: (index: number) => void;
}

/**
 * ProgressBar component that shows segment progress
 * Allows clicking to jump to specific segments and drag-and-drop to reorder
 */
export function ProgressBar({ currentIndex, total, onNavigate, onReorder, onDelete }: ProgressBarProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (!onReorder) return;
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    if (!onReorder || draggedIndex === null) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, toIndex: number) => {
    e.preventDefault();
    if (!onReorder || draggedIndex === null || draggedIndex === toIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }
    
    onReorder(draggedIndex, toIndex);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDelete = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    if (onDelete && total > 1) {
      if (window.confirm(`Delete slide ${index + 1}?`)) {
        onDelete(index);
      }
    }
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-md z-40"
      aria-label="Slide progress"
    >
      <div className="flex items-center justify-center h-16 px-4">
        <div className="flex items-center space-x-2">
          {Array.from({ length: total }, (_, i) => (
            <div 
              key={i} 
              className="relative group"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <button
                draggable={onReorder !== undefined}
                onDragStart={(e) => handleDragStart(e, i)}
                onDragOver={(e) => handleDragOver(e, i)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, i)}
                onDragEnd={handleDragEnd}
                onClick={() => onNavigate(i)}
                className={`w-10 h-10 rounded-full font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  draggedIndex === i
                    ? 'opacity-50 scale-95'
                    : dragOverIndex === i
                    ? 'ring-2 ring-yellow-400 scale-105'
                    : i === currentIndex
                    ? 'bg-primary-500 text-white scale-110'
                    : i < currentIndex
                    ? 'bg-primary-200 dark:bg-primary-700 text-primary-900 dark:text-primary-100 hover:bg-primary-300 dark:hover:bg-primary-600'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
                } ${
                  onReorder ? 'cursor-move' : 'cursor-pointer'
                }`}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === currentIndex ? 'true' : 'false'}
                title={onReorder ? 'Click to navigate, drag to reorder' : `Go to slide ${i + 1}`}
              >
                {i + 1}
              </button>
              {onDelete && hoveredIndex === i && total > 1 && (
                <button
                  onClick={(e) => handleDelete(e, i)}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold transition-colors shadow-md"
                  aria-label={`Delete slide ${i + 1}`}
                  title="Delete slide"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
        <span className="ml-4 text-sm text-gray-600 dark:text-gray-400">
          {currentIndex + 1} / {total}
        </span>
      </div>
    </nav>
  );
}
