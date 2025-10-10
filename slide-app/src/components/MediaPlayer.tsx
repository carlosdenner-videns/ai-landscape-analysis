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
  
  // Debug: log the constructed image path
  if (media.type === 'image') {
    const imagePath = `${import.meta.env.BASE_URL}${media.src}?v=2`;
    console.log('Image path:', imagePath, 'BASE_URL:', import.meta.env.BASE_URL, 'media.src:', media.src);
  }

  switch (media.type) {
    case 'image':
      return (
        <figure className={baseClass}>
          <img
            src={`${import.meta.env.BASE_URL}${media.src}?v=3`}
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
            src={`${import.meta.env.BASE_URL}${media.src}`}
            poster={media.poster ? `${import.meta.env.BASE_URL}${media.poster}` : undefined}
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
