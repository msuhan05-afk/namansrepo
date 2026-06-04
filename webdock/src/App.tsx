import { useCallback, useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { SmartSearchBar } from '@/components/search/SmartSearchBar';
import { BrowserPanel } from '@/components/browser/BrowserPanel';
import { AIAssistantPanel } from '@/components/ai/AIAssistantPanel';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { useBrowserState } from '@/hooks/useBrowserState';
import type { WebService } from '@/types';

/**
 * Root WebDock shell.
 *
 * Layout: [ sidebar rail | workspace ]
 *   workspace = smart search bar (top) + browser panel (fills) and a slide-in
 *   AI assistant overlay anchored to the right edge.
 *
 * Navigation state is owned by `useBrowserState` and shared down so the
 * sidebar, search bar, and assistant all drive the same browser.
 */
export function App() {
  const browser = useBrowserState();
  const [assistantOpen, setAssistantOpen] = useState(false);

  const handleSelectService = useCallback(
    (service: WebService) => {
      browser.navigate(service.url, service.id);
    },
    [browser],
  );

  return (
    <div className="wd-app">
      <ErrorBoundary region="sidebar">
        <Sidebar
          activeServiceId={browser.activeServiceId}
          onSelect={handleSelectService}
          onToggleAssistant={() => setAssistantOpen((v) => !v)}
          assistantOpen={assistantOpen}
        />
      </ErrorBoundary>

      <div className="wd-workspace">
        <ErrorBoundary region="search">
          <SmartSearchBar currentUrl={browser.url} onNavigate={browser.navigate} />
        </ErrorBoundary>

        <BrowserPanel browser={browser} />

        <AIAssistantPanel
          open={assistantOpen}
          onClose={() => setAssistantOpen(false)}
          onNavigate={browser.navigate}
        />
      </div>
    </div>
  );
}
