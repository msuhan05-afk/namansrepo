import { useCallback, useMemo, useReducer } from 'react';
import type { LoadStatus } from '@/types';
import { DEFAULT_SERVICE_ID, SERVICE_MAP } from '@/data/services';

/**
 * Centralized browser navigation state: current URL, history stack, load
 * status, and the active service. Implemented as a reducer so back/forward
 * stay consistent and easy to reason about.
 */

interface BrowserState {
  /** Full history of visited URLs. */
  history: string[];
  /** Pointer into `history` for the current page. */
  index: number;
  status: LoadStatus;
  error: string | null;
  /** Id of the sidebar service that "owns" the current page, if any. */
  activeServiceId: string | null;
}

type BrowserAction =
  | { type: 'navigate'; url: string; serviceId: string | null }
  | { type: 'back' }
  | { type: 'forward' }
  | { type: 'status'; status: LoadStatus; error?: string | null };

function reducer(state: BrowserState, action: BrowserAction): BrowserState {
  switch (action.type) {
    case 'navigate': {
      if (action.url === state.history[state.index]) {
        // Re-navigating to the same URL → just reload, keep history.
        return { ...state, status: 'loading', error: null, activeServiceId: action.serviceId };
      }
      const trimmed = state.history.slice(0, state.index + 1);
      const history = [...trimmed, action.url];
      return {
        history,
        index: history.length - 1,
        status: 'loading',
        error: null,
        activeServiceId: action.serviceId,
      };
    }
    case 'back':
      if (state.index <= 0) return state;
      return { ...state, index: state.index - 1, status: 'loading', error: null };
    case 'forward':
      if (state.index >= state.history.length - 1) return state;
      return { ...state, index: state.index + 1, status: 'loading', error: null };
    case 'status':
      return { ...state, status: action.status, error: action.error ?? null };
    default:
      return state;
  }
}

export interface UseBrowserState {
  url: string;
  status: LoadStatus;
  error: string | null;
  activeServiceId: string | null;
  canGoBack: boolean;
  canGoForward: boolean;
  navigate: (url: string, serviceId?: string | null) => void;
  goBack: () => void;
  goForward: () => void;
  reload: () => void;
  goHome: () => void;
  setStatus: (status: LoadStatus, error?: string | null) => void;
}

export function useBrowserState(): UseBrowserState {
  const initialUrl = SERVICE_MAP[DEFAULT_SERVICE_ID].url;
  const [state, dispatch] = useReducer(reducer, {
    history: [initialUrl],
    index: 0,
    status: 'idle',
    error: null,
    activeServiceId: DEFAULT_SERVICE_ID,
  });

  const url = state.history[state.index];

  const navigate = useCallback((nextUrl: string, serviceId: string | null = null) => {
    dispatch({ type: 'navigate', url: nextUrl, serviceId });
  }, []);

  const goBack = useCallback(() => dispatch({ type: 'back' }), []);
  const goForward = useCallback(() => dispatch({ type: 'forward' }), []);
  const reload = useCallback(
    () => dispatch({ type: 'navigate', url, serviceId: state.activeServiceId }),
    [url, state.activeServiceId],
  );
  const goHome = useCallback(() => {
    const home = SERVICE_MAP[DEFAULT_SERVICE_ID];
    dispatch({ type: 'navigate', url: home.url, serviceId: home.id });
  }, []);
  const setStatus = useCallback(
    (status: LoadStatus, error: string | null = null) =>
      dispatch({ type: 'status', status, error }),
    [],
  );

  return useMemo(
    () => ({
      url,
      status: state.status,
      error: state.error,
      activeServiceId: state.activeServiceId,
      canGoBack: state.index > 0,
      canGoForward: state.index < state.history.length - 1,
      navigate,
      goBack,
      goForward,
      reload,
      goHome,
      setStatus,
    }),
    [url, state, navigate, goBack, goForward, reload, goHome, setStatus],
  );
}
