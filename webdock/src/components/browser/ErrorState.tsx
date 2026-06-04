import { Icon } from '@/components/common/Icon';

interface ErrorStateProps {
  message: string;
  url: string;
  onRetry: () => void;
  onOpenExternal: () => void;
}

/**
 * Full-panel error surface shown when a page fails to load (offline, blocked
 * framing, bad URL). Offers a retry and an "open in external browser" escape
 * hatch — the latter is the reliable fallback for sites that refuse embedding.
 */
export function ErrorState({ message, url, onRetry, onOpenExternal }: ErrorStateProps) {
  return (
    <div className="wd-errorstate" role="alert">
      <div className="wd-errorstate__card">
        <div className="wd-errorstate__glyph">
          <Icon name="close" size={26} />
        </div>
        <h2>This page didn’t load</h2>
        <p>{message}</p>
        <p className="wd-errorstate__url">{url}</p>
        <div className="wd-errorstate__actions">
          <button type="button" className="wd-btn wd-btn--primary" onClick={onRetry}>
            <Icon name="refresh" size={15} />
            Try again
          </button>
          <button type="button" className="wd-btn" onClick={onOpenExternal}>
            <Icon name="external" size={15} />
            Open in browser
          </button>
        </div>
      </div>
    </div>
  );
}
