import { BrowserToolbar } from './BrowserToolbar';
import { WebView } from './WebView';
import { LoadingBar } from './LoadingState';
import { ErrorState } from './ErrorState';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { openInExternalBrowser } from '@/services/uxp/externalBrowser';
import type { UseBrowserState } from '@/hooks/useBrowserState';
import './browser.css';

interface BrowserPanelProps {
  browser: UseBrowserState;
}

/**
 * The main web area: toolbar + the web surface that fills the workspace.
 * Loading is shown as a non-blocking top bar; a hard load failure swaps in the
 * full-panel ErrorState.
 */
export function BrowserPanel({ browser }: BrowserPanelProps) {
  const { url, status, error, setStatus, reload } = browser;

  const handleOpenExternal = () => {
    void openInExternalBrowser(url);
  };

  return (
    <div className="wd-browser">
      <BrowserToolbar browser={browser} onOpenExternal={handleOpenExternal} />

      <div className="wd-browser__stage">
        {status === 'loading' && <LoadingBar />}

        <ErrorBoundary region="browser">
          {status === 'error' ? (
            <ErrorState
              message={error ?? 'The page could not be displayed.'}
              url={url}
              onRetry={reload}
              onOpenExternal={handleOpenExternal}
            />
          ) : (
            <WebView url={url} onStatusChange={setStatus} />
          )}
        </ErrorBoundary>
      </div>
    </div>
  );
}
