import { useEffect, useRef } from 'react';
import type { LoadStatus } from '@/types';
import { isUXP } from '@/services/uxp/uxp';

/**
 * The actual web surface.
 *
 * Adobe-specific: inside UXP we render the host's native `<webview>` element
 * (enabled by the `webview` permission in the manifest). UXP's webview does NOT
 * expose a stable programmatic history API across Premiere versions, so all
 * navigation is driven by swapping `src` — our `useBrowserState` reducer owns
 * the back/forward stack instead.
 *
 * Outside UXP (vite dev) we fall back to an `<iframe>` so the UI is testable in
 * a normal browser. Many sites block framing via X-Frame-Options/CSP; that's a
 * dev-only limitation and does not affect the real plugin.
 */

interface WebViewProps {
  url: string;
  onStatusChange: (status: LoadStatus, error?: string | null) => void;
}

// `<webview>` is provided by React's JSX types (HTMLWebViewElement). UXP and
// Chromium implement extra members (a settable `src`, load events) that the
// stock DOM lib doesn't model, so we treat the ref loosely.
type WebViewElement = HTMLElement & { src?: string };

export function WebView({ url, onStatusChange }: WebViewProps) {
  const hostRef = useRef<WebViewElement>(null);
  const inUXP = isUXP();

  // Wire native webview load events when running inside the host.
  useEffect(() => {
    const el = hostRef.current;
    if (!inUXP || !el) return;

    const handleStart = () => onStatusChange('loading');
    const handleStop = () => onStatusChange('loaded');
    const handleError = (e: Event) =>
      onStatusChange('error', (e as CustomEvent)?.detail ?? 'Failed to load page.');

    // UXP webview emits these DOM events; names mirror Chromium's webview tag.
    el.addEventListener('loadstart', handleStart);
    el.addEventListener('loadstop', handleStop);
    el.addEventListener('loaderror', handleError as EventListener);
    el.addEventListener('didfailload', handleError as EventListener);

    return () => {
      el.removeEventListener('loadstart', handleStart);
      el.removeEventListener('loadstop', handleStop);
      el.removeEventListener('loaderror', handleError as EventListener);
      el.removeEventListener('didfailload', handleError as EventListener);
    };
  }, [inUXP, onStatusChange]);

  // Keep the element's src in sync with our navigation state.
  useEffect(() => {
    const el = hostRef.current;
    if (inUXP && el) {
      el.src = url;
      onStatusChange('loading');
    }
  }, [url, inUXP, onStatusChange]);

  if (inUXP) {
    // Cast the ref: React types `webview` as HTMLWebViewElement, but we need
    // the extended shape (settable `src`) declared above.
    return (
      <webview
        ref={hostRef as React.Ref<HTMLWebViewElement>}
        src={url}
        className="wd-webview"
      />
    );
  }

  // Dev fallback.
  return (
    <iframe
      title="WebDock browser"
      src={url}
      className="wd-webview"
      onLoad={() => onStatusChange('loaded')}
      onError={() => onStatusChange('error', 'Failed to load page.')}
      // Allow most capabilities for realistic dev testing.
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
    />
  );
}
