import type { ServiceResult, WebService } from '@/types';
import { SERVICE_MAP } from '@/data/services';

/**
 * WebDock AI Assistant — ARCHITECTURE / PLACEHOLDER.
 *
 * The long-term vision is a natural-language command bar ("Find B-roll of
 * London", "Generate podcast hooks") that maps an intent to an action: either
 * navigating a service or kicking off an asset search/download.
 *
 * For now this module provides:
 *   - a typed `AIIntent` model,
 *   - a deterministic, offline `routeIntent` that maps phrasing to a service
 *     navigation (no network, no fake "AI" output), and
 *   - a clearly-marked stub for a future LLM-backed planner.
 */

export type AIIntentKind = 'navigate' | 'search' | 'asset' | 'unknown';

export interface AIIntent {
  kind: AIIntentKind;
  /** Resolved service the intent should act on, if any. */
  service?: WebService;
  /** Cleaned query text extracted from the prompt. */
  query?: string;
  /** A short, honest human explanation of what WebDock will do. */
  explanation: string;
}

/** Lightweight keyword → service routing table for the offline planner. */
const ROUTING_RULES: Array<{ test: RegExp; serviceId: string }> = [
  { test: /\b(b-?roll|footage|stock video|video clip)\b/i, serviceId: 'pexels' },
  { test: /\b(photo|image|picture|wallpaper|thumbnail)\b/i, serviceId: 'unsplash' },
  { test: /\b(music|song|audio|sound|track)\b/i, serviceId: 'youtube' },
  { test: /\b(hook|script|caption|title|idea|brainstorm)\b/i, serviceId: 'chatgpt' },
  { test: /\b(summari[sz]e|research|cite|source)\b/i, serviceId: 'perplexity' },
  { test: /\b(review|approve|client cut|share cut)\b/i, serviceId: 'frameio' },
];

/**
 * Deterministic, offline intent router. This is NOT an LLM — it is honest
 * keyword routing so the assistant does something useful today without
 * pretending to generate content.
 */
export function routeIntent(prompt: string): AIIntent {
  const query = prompt.trim();
  if (!query) {
    return { kind: 'unknown', explanation: 'Type what you need and WebDock will route it.' };
  }

  for (const rule of ROUTING_RULES) {
    if (rule.test.test(query)) {
      const service = SERVICE_MAP[rule.serviceId];
      return {
        kind: service.searchTemplate ? 'search' : 'navigate',
        service,
        query,
        explanation: `Open ${service.name} for “${query}”.`,
      };
    }
  }

  // Default: hand off to Google web search.
  const google = SERVICE_MAP['google'];
  return {
    kind: 'search',
    service: google,
    query,
    explanation: `Search Google for “${query}”.`,
  };
}

/**
 * Future LLM-backed planner.
 *
 * FUTURE IMPLEMENTATION: call a hosted model (e.g. the Claude API) to turn a
 * prompt into a structured plan, optionally chaining asset search + import.
 * Left unimplemented on purpose — no fake responses.
 */
export async function planWithModel(_prompt: string): Promise<ServiceResult<AIIntent>> {
  return {
    ok: false,
    error: 'Model-backed planning is not implemented yet (placeholder).',
  };
}
