import { IconButton } from '@/components/common/IconButton';
import type { UseBrowserState } from '@/hooks/useBrowserState';

interface BrowserToolbarProps {
  browser: UseBrowserState;
  onOpenExternal: () => void;
}

/**
 * Compact navigation toolbar: back / forward / reload / home on the left, and
 * the "open in external browser" action on the right. The URL/search input
 * lives in the SmartSearchBar above, keeping this row purely about navigation.
 */
export function BrowserToolbar({ browser, onOpenExternal }: BrowserToolbarProps) {
  const { canGoBack, canGoForward, goBack, goForward, reload, goHome } = browser;

  return (
    <div className="wd-toolbar wd-glass">
      <div className="wd-toolbar__group">
        <IconButton icon="back" label="Back" onClick={goBack} disabled={!canGoBack} />
        <IconButton
          icon="forward"
          label="Forward"
          onClick={goForward}
          disabled={!canGoForward}
        />
        <IconButton icon="refresh" label="Reload" onClick={reload} />
        <IconButton icon="home" label="Home" onClick={goHome} />
      </div>

      <div className="wd-toolbar__spacer" />

      <div className="wd-toolbar__group">
        <IconButton icon="external" label="Open in external browser" onClick={onOpenExternal} />
      </div>
    </div>
  );
}
