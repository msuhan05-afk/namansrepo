import { useCallback, useState } from 'react';
import type { DesignSystem, ExtractResponse } from '../lib/types';

type Status = 'idle' | 'loading' | 'done' | 'error';

interface ExtractState {
  status: Status;
  data: DesignSystem | null;
  error: string | null;
  extract: () => Promise<void>;
}

// Works with both Chrome's `chrome` and Firefox's `browser`-aliased `chrome`.
function getActiveTab(): Promise<chrome.tabs.Tab | undefined> {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) =>
      resolve(tabs[0]),
    );
  });
}

function injectContentScript(tabId: number): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.scripting.executeScript(
      { target: { tabId }, files: ['content.js'] },
      () => {
        const err = chrome.runtime.lastError;
        if (err) reject(new Error(err.message));
        else resolve();
      },
    );
  });
}

function requestExtract(tabId: number): Promise<ExtractResponse> {
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(
      tabId,
      { type: 'DESIGN_DNA_EXTRACT' },
      (response: ExtractResponse) => {
        const err = chrome.runtime.lastError;
        if (err) reject(new Error(err.message));
        else resolve(response);
      },
    );
  });
}

export function useExtract(): ExtractState {
  const [status, setStatus] = useState<Status>('idle');
  const [data, setData] = useState<DesignSystem | null>(null);
  const [error, setError] = useState<string | null>(null);

  const extract = useCallback(async () => {
    setStatus('loading');
    setError(null);
    try {
      const tab = await getActiveTab();
      if (!tab?.id) throw new Error('No active tab found.');
      const url = tab.url ?? '';
      if (/^(chrome|edge|about|moz-extension|chrome-extension):/.test(url)) {
        throw new Error('Design DNA can’t analyze browser system pages. Open a website and try again.');
      }
      await injectContentScript(tab.id);
      const response = await requestExtract(tab.id);
      if (!response?.ok) throw new Error(response?.error ?? 'Extraction failed.');
      setData(response.data);
      setStatus('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setStatus('error');
    }
  }, []);

  return { status, data, error, extract };
}
