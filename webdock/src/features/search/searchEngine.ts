import type { SearchSuggestion, WebService } from '@/types';
import { SEARCHABLE_SERVICES, SERVICE_MAP } from '@/data/services';

/** Build a concrete URL by substituting `%s` in a service's search template. */
export function buildSearchUrl(service: WebService, query: string): string {
  if (!service.searchTemplate) return service.url;
  return service.searchTemplate.replace('%s', encodeURIComponent(query.trim()));
}

/** Returns true when the raw input already looks like a URL. */
export function looksLikeUrl(input: string): boolean {
  const value = input.trim();
  if (!value || /\s/.test(value)) return false;
  if (/^https?:\/\//i.test(value)) return true;
  // bare domain like "frame.io" or "youtube.com/feed"
  return /^[a-z0-9-]+(\.[a-z0-9-]+)+(\/\S*)?$/i.test(value);
}

/** Normalize a URL-ish string into a navigable absolute URL. */
export function normalizeUrl(input: string): string {
  const value = input.trim();
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

/**
 * Quick-search ordering. We surface the most relevant services first so the
 * dropdown reads like Raycast: the editor's intent, ranked.
 */
const QUICK_SEARCH_ORDER = ['google', 'youtube', 'chatgpt', 'pexels'];

/**
 * Produce search suggestions for a free-text query.
 *
 * When the input looks like a URL we offer a single "Go to" suggestion;
 * otherwise we fan the query out across the prioritized searchable services.
 */
export function getSuggestions(rawQuery: string): SearchSuggestion[] {
  const query = rawQuery.trim();
  if (!query) return [];

  if (looksLikeUrl(query)) {
    const url = normalizeUrl(query);
    return [
      {
        id: `goto:${url}`,
        serviceId: 'custom',
        label: `Go to ${query}`,
        icon: 'external',
        url,
      },
    ];
  }

  const ordered = [
    ...QUICK_SEARCH_ORDER.map((id) => SERVICE_MAP[id]).filter(
      (s): s is WebService => Boolean(s?.searchTemplate),
    ),
    ...SEARCHABLE_SERVICES.filter((s) => !QUICK_SEARCH_ORDER.includes(s.id)),
  ];

  return ordered.map((service) => ({
    id: `${service.id}:${query}`,
    serviceId: service.id,
    label: `Search ${service.name}`,
    icon: service.icon,
    url: buildSearchUrl(service, query),
  }));
}
