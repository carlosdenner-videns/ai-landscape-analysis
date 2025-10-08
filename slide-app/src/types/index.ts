/**
 * Media item types for different content formats
 */
export type MediaItem =
  | { type: 'image'; src: string; alt: string; caption?: string }
  | { type: 'videoLocal'; src: string; poster?: string; caption?: string }
  | { type: 'videoYouTube'; id: string; caption?: string }
  | { type: 'embed'; html: string; caption?: string };

/**
 * Citation with label and external URL
 */
export type Citation = {
  label: string;
  url: string;
};

/**
 * Engagement prompt for audience interaction
 */
export type Engagement = {
  prompt: string;
};

/**
 * Individual slide segment
 */
export type Segment = {
  id: string;
  title: string;
  subtitle?: string;
  bullets: string[];
  media: MediaItem[];
  engagement?: Engagement;
  citations?: Citation[];
  notes?: string;
};

/**
 * Complete deck with metadata
 */
export type Deck = {
  segments: Segment[];
  meta: {
    author?: string;
    version?: string;
  };
};

/**
 * Supported languages
 */
export type Language = 'en' | 'es' | 'pt';

/**
 * Theme modes
 */
export type Theme = 'light' | 'dark';
