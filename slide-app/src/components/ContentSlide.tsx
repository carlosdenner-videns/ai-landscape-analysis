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
    <div className={`h-full flex flex-col px-12 pt-20 pb-6 overflow-hidden ${className}`}>
      {/* Header Section - Compact and bold, with top margin to avoid buttons */}
      <header className="mb-6 flex-shrink-0">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-2">
          {title}
        </h1>
        {subtitle && (
          <h2 className="text-xl md:text-2xl lg:text-3xl text-primary-600 dark:text-primary-400 leading-tight font-medium">
            {subtitle}
          </h2>
        )}
      </header>

      {/* Main Content Grid - Full height utilization with 40/60 split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 flex-1 min-h-0 overflow-hidden">
        {/* Left Column: Text Content (40%) */}
        <div className="lg:col-span-5 flex flex-col justify-center overflow-y-auto pr-4">
          {leftContent}
        </div>

        {/* Right Column: Visual Content (60%) */}
        {rightContent && (
          <div className="lg:col-span-7 flex flex-col items-center justify-center overflow-hidden">
            {rightContent}
          </div>
        )}

        {/* If no right content, left content spans full width */}
        {!rightContent && (
          <div className="lg:col-span-7"></div>
        )}
      </div>

      {/* Bottom Section: Engagement/Citations - Always visible */}
      {bottomContent && (
        <div className="mt-3 mb-16 flex-shrink-0">
          {bottomContent}
        </div>
      )}
    </div>
  );
}
