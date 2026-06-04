import type { WebService } from '@/types';

/**
 * The canonical catalog of services WebDock can dock.
 *
 * Order here defines sidebar order. `searchTemplate` entries power the smart
 * search bar — services without one simply open their landing page.
 */
export const SERVICES: WebService[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    url: 'https://chat.openai.com/',
    accent: '#10a37f',
    icon: 'chatgpt',
    searchTemplate: 'https://chat.openai.com/?q=%s',
    description: 'Brainstorm hooks, scripts, and titles with OpenAI.',
  },
  {
    id: 'claude',
    name: 'Claude',
    url: 'https://claude.ai/',
    accent: '#d97757',
    icon: 'claude',
    searchTemplate: 'https://claude.ai/new?q=%s',
    description: 'Long-form reasoning and writing with Anthropic Claude.',
  },
  {
    id: 'gemini',
    name: 'Gemini',
    url: 'https://gemini.google.com/',
    accent: '#4285f4',
    icon: 'gemini',
    searchTemplate: 'https://gemini.google.com/app?q=%s',
    description: "Google's multimodal assistant.",
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    url: 'https://www.perplexity.ai/',
    accent: '#20808d',
    icon: 'perplexity',
    searchTemplate: 'https://www.perplexity.ai/search?q=%s',
    description: 'Cited answers and research, fast.',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    url: 'https://www.youtube.com/',
    accent: '#ff0033',
    icon: 'youtube',
    searchTemplate: 'https://www.youtube.com/results?search_query=%s',
    description: 'Reference edits, tutorials, and B-roll inspiration.',
  },
  {
    id: 'pexels',
    name: 'Pexels',
    url: 'https://www.pexels.com/',
    accent: '#05a081',
    icon: 'pexels',
    searchTemplate: 'https://www.pexels.com/search/%s/',
    description: 'Free stock video and photos.',
  },
  {
    id: 'unsplash',
    name: 'Unsplash',
    url: 'https://unsplash.com/',
    accent: '#cccccc',
    icon: 'unsplash',
    searchTemplate: 'https://unsplash.com/s/photos/%s',
    description: 'High-resolution free photography.',
  },
  {
    id: 'google',
    name: 'Google',
    url: 'https://www.google.com/',
    accent: '#4285f4',
    icon: 'google',
    searchTemplate: 'https://www.google.com/search?q=%s',
    description: 'Search the entire web.',
  },
  {
    id: 'frameio',
    name: 'Frame.io',
    url: 'https://app.frame.io/',
    accent: '#5b53ff',
    icon: 'frameio',
    description: 'Review, share, and collaborate on cuts.',
  },
  {
    id: 'custom',
    name: 'Custom',
    url: 'about:blank',
    accent: '#8e8e93',
    icon: 'custom',
    description: 'Load any URL you like.',
  },
];

/** The service selected on first launch. */
export const DEFAULT_SERVICE_ID = 'chatgpt';

/** Convenience lookup by id. */
export const SERVICE_MAP: Record<string, WebService> = Object.fromEntries(
  SERVICES.map((s) => [s.id, s]),
);

/** Services that can resolve a free-text query into a URL. */
export const SEARCHABLE_SERVICES = SERVICES.filter((s) => Boolean(s.searchTemplate));
