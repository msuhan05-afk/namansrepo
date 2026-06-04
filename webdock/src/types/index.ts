/**
 * Shared domain types for WebDock.
 *
 * Keeping these in one place makes the feature modules (navigation, browser,
 * search, ai, assets) compose without circular imports.
 */

/** A web service surfaced in the sidebar. */
export interface WebService {
  /** Stable identifier, also used for active-state tracking. */
  id: string;
  /** Display name shown in tooltips / labels. */
  name: string;
  /** Default URL loaded when the service is selected. */
  url: string;
  /** Brand accent color (hex) used for the active-state glow. */
  accent: string;
  /** Key into the icon registry. */
  icon: IconName;
  /**
   * Optional template that turns a free-text query into a search URL.
   * `%s` is replaced with the URL-encoded query.
   */
  searchTemplate?: string;
  /** Short marketing-style description shown in the empty state. */
  description?: string;
}

/** Names registered in the inline SVG icon set. */
export type IconName =
  | 'chatgpt'
  | 'claude'
  | 'gemini'
  | 'perplexity'
  | 'youtube'
  | 'pexels'
  | 'unsplash'
  | 'google'
  | 'frameio'
  | 'custom'
  | 'back'
  | 'forward'
  | 'refresh'
  | 'home'
  | 'external'
  | 'search'
  | 'sparkles'
  | 'close'
  | 'download'
  | 'image'
  | 'video'
  | 'audio'
  | 'plus';

/** Lifecycle of a page load inside the browser panel. */
export type LoadStatus = 'idle' | 'loading' | 'loaded' | 'error';

/** A single suggestion produced by the smart search bar. */
export interface SearchSuggestion {
  id: string;
  /** Which service this suggestion will search against. */
  serviceId: string;
  /** Human label, e.g. "Search YouTube for podcast thumbnails". */
  label: string;
  icon: IconName;
  /** Fully resolved URL to navigate to when chosen. */
  url: string;
}

/** Supported downloadable asset categories. */
export type AssetKind = 'image' | 'video' | 'audio';

/** Metadata describing an asset the user wants to bring into Premiere. */
export interface AssetCandidate {
  id: string;
  kind: AssetKind;
  /** Source page or direct media URL. */
  url: string;
  /** Optional display name. */
  title?: string;
  /** Originating service id. */
  source?: string;
}

/** Result envelope for async service-layer operations. */
export type ServiceResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string };
