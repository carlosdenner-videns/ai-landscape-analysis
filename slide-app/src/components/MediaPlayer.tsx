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
  const baseClass = `w-full max-w-4xl mx-auto ${className}`;

  switch (media.type) {
    case 'image':
      return (
        <figure className={baseClass}>
          <img
            src={media.src}
            alt={media.alt}
            className="w-full h-auto rounded-lg shadow-lg"
            loading="lazy"
          />
          {media.caption && (
            <figcaption className="mt-2 text-sm text-center text-gray-600 dark:text-gray-400">
              {media.caption}
            </figcaption>
          )}
        </figure>
      );

    case 'videoLocal':
      return (
        <figure className={baseClass}>
          <video
            src={media.src}
            poster={media.poster}
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
