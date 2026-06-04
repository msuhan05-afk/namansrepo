import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import './styles/global.css';

/**
 * Entry point.
 *
 * Adobe-specific: UXP creates the panel's DOM and loads this bundle when the
 * editor opens the WebDock panel. The `#root` node is defined in index.html.
 * We mount synchronously; UXP does not require any special bootstrap beyond a
 * valid DOM node, but we guard against a missing root so a manifest/HTML
 * mismatch fails loudly in the host console rather than silently.
 */
const container = document.getElementById('root');
if (!container) {
  throw new Error('[WebDock] #root element not found — check index.html / manifest main.');
}

createRoot(container).render(
  <StrictMode>
    <ErrorBoundary region="root">
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
