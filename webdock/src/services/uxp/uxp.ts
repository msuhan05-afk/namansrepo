/**
 * Thin, defensively-typed access layer over the Adobe UXP runtime.
 *
 * The same React bundle runs in two places:
 *   1. Inside Premiere Pro (the real UXP host), where `require('uxp')` works.
 *   2. In a normal browser via `vite dev`, for fast UI iteration.
 *
 * Every accessor below degrades gracefully so the UI never crashes when a host
 * API is missing. Anything that touches UXP is funneled through here so the
 * rest of the app stays host-agnostic.
 */

// UXP exposes CommonJS-style modules via a global `require`. We declare it
// loosely because there are no first-party types bundled with the plugin.
declare const require: ((module: string) => unknown) | undefined;

/** True only when running inside the actual UXP host. */
export function isUXP(): boolean {
  try {
    return typeof require === 'function' && Boolean(require('uxp'));
  } catch {
    return false;
  }
}

/** Safely `require` a UXP module, returning `null` outside the host. */
function safeRequire<T = unknown>(moduleName: string): T | null {
  try {
    if (typeof require !== 'function') return null;
    return require(moduleName) as T;
  } catch {
    return null;
  }
}

/** The `uxp` core module, or null in the browser. */
export function getUxpModule(): UxpModule | null {
  return safeRequire<UxpModule>('uxp');
}

/** The Premiere Pro host module (`premierepro`), or null outside the host. */
export function getPremiereModule(): unknown | null {
  return safeRequire('premierepro');
}

/* ----------------------------------------------------------------------------
 * Minimal structural typings for the UXP surfaces we actually call.
 * These intentionally cover only what WebDock uses.
 * ------------------------------------------------------------------------- */

export interface UxpModule {
  shell?: {
    /** Opens a URL or path in the OS default handler (e.g. the browser). */
    openExternal(url: string): Promise<void>;
        openPath?(path: string): Promise<void>;
  };
  storage?: {
    localFileSystem?: unknown;
  };
}

export const uxp = {
  isUXP,
  getUxpModule,
  getPremiereModule,
};
