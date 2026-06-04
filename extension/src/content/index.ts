// Content script: injected on demand into the active tab. It listens for an
// extract request from the popup, runs the analyzer against the live DOM, and
// returns the resulting design system. Guarded so re-injection is harmless.

import { analyzePage } from '../lib/analyze';
import type { ExtractMessage, ExtractResponse } from '../lib/types';

declare global {
  interface Window {
    __designDnaInjected?: boolean;
  }
}

if (!window.__designDnaInjected) {
  window.__designDnaInjected = true;

  chrome.runtime.onMessage.addListener(
    (message: ExtractMessage, _sender, sendResponse: (r: ExtractResponse) => void) => {
      if (message?.type !== 'DESIGN_DNA_EXTRACT') return undefined;
      try {
        const data = analyzePage();
        sendResponse({ ok: true, data });
      } catch (err) {
        sendResponse({
          ok: false,
          error: err instanceof Error ? err.message : String(err),
        });
      }
      // Synchronous response; no need to keep the channel open.
      return false;
    },
  );
}
