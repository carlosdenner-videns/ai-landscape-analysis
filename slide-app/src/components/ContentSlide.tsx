import { ReactNode } from 'react';

/**
 * Props for ContentSlide template component
 */
interface ContentSlideProps {
  /** Main slide title */
  title: string;
  /** Optional subtitle */
  subtitle?: string;
  /** Left column content (bullets, text, etc.) */
  leftContent: ReactNode;
  /** Right column content (media, charts, etc.) */
  rightContent?: ReactNode;
  /** Optional bottom content (engagement, citations, etc.) */
  bottomContent?: ReactNode;
  /** Optional custom class for the container */
  className?: string;
}

/**
 * ContentSlide - Reusable template for content slides
 * Provides a consistent two-column layout with balanced proportions
 * 
 * Layout structure:
 * - Header (title + subtitle)
 * - Two-column grid (40/60 split for better balance)
 *   - Left: Content (bullets, text)
 *   - Right: Visual (media, charts)
 * - Bottom: Optional engagement/citations
 */
export function ContentSlide({
  title,
  subtitle,
  leftContent,
  rightContent,
  bottomContent,
  className = ''
}: ContentSlideProps) {
  return (
    <div className={`h-full flex flex-col px-8 py-6 overflow-y-auto ${className}`}>
      {/* Header Section - More compact */}
      <header className="mb-6">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-2">
          {title}
        </h1>
        {subtitle && (
          <h2 className="text-lg md:text-xl lg:text-2xl text-primary-600 dark:text-primary-400 leading-relaxed font-medium">
            {subtitle}
          </h2>
        )}
      </header>

      {/* Main Content Grid - Balanced 45/55 split with better alignment */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 flex-1 items-start">
        {/* Left Column: Text Content (45%) */}
        <div className="lg:col-span-5 flex flex-col justify-start h-full">
          {leftContent}
        </div>

        {/* Right Column: Visual Content (55%) */}
        {rightContent && (
          <div className="lg:col-span-7 flex flex-col items-center justify-center h-full">
            {rightContent}
          </div>
        )}

        {/* If no right content, left content spans full width */}
        {!rightContent && (
          <div className="lg:col-span-7"></div>
        )}
      </div>

      {/* Bottom Section: Engagement/Citations */}
      {bottomContent && (
        <div className="mt-6 pt-4">
          {bottomContent}
        </div>
      )}
    </div>
  );
}
