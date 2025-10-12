import { MediaItem } from '../types';

/**
 * Props for MediaPlayer component
 */
interface MediaPlayerProps {
  media: MediaItem;
  className?: string;
}

/**
 * MediaPlayer component that renders different media types
 * Supports images, local videos, YouTube embeds, and custom HTML
 */
export function MediaPlayer({ media, className = '' }: MediaPlayerProps) {
  const baseClass = `w-full h-full flex flex-col items-center justify-center ${className}`;

  // Helper function to get the correct image URL
  const getImageUrl = (src: string) => {
    // If URL is already absolute (starts with http:// or https://), use it as-is
    if (src.startsWith('http://') || src.startsWith('https://')) {
      return src;
    }
    // Otherwise, prepend BASE_URL for relative paths
    return `${import.meta.env.BASE_URL}${src}`;
  };

  switch (media.type) {
    case 'image':
      return (
        <figure className={baseClass}>
          <img
            src={getImageUrl(media.src)}
            alt={media.alt}
            className="w-full h-full object-contain rounded-lg shadow-xl"
            loading="eager"
            onError={(e) => {
              console.error('Image failed to load:', media.src);
              e.currentTarget.style.display = 'none';
            }}
          />
          {media.caption && (
            <figcaption className="mt-3 text-xs text-center text-gray-500 dark:text-gray-400">
              {media.caption}
            </figcaption>
          )}
        </figure>
      );

    case 'videoLocal':
      return (
        <figure className={baseClass}>
          <video
            src={getImageUrl(media.src)}
            poster={media.poster ? getImageUrl(media.poster) : undefined}
            controls
            className="w-full h-auto rounded-lg shadow-lg"
            preload="metadata"
          >
            Your browser does not support the video tag.
          </video>
          {media.caption && (
            <figcaption className="mt-2 text-sm text-center text-gray-600 dark:text-gray-400">
              {media.caption}
            </figcaption>
          )}
        </figure>
      );

    case 'videoYouTube':
      return (
        <figure className={baseClass}>
          <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${media.id}`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
          {media.caption && (
            <figcaption className="mt-2 text-sm text-center text-gray-600 dark:text-gray-400">
              {media.caption}
            </figcaption>
          )}
        </figure>
      );

    case 'embed':
      return (
        <figure className={baseClass}>
          <div
            className="rounded-lg shadow-lg overflow-hidden"
            dangerouslySetInnerHTML={{ __html: media.html }}
          />
          {media.caption && (
            <figcaption className="mt-2 text-sm text-center text-gray-600 dark:text-gray-400">
              {media.caption}
            </figcaption>
          )}
        </figure>
      );

    default:
      return null;
  }
}
