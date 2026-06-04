import { Component, type ErrorInfo, type ReactNode } from 'react';
import './ErrorBoundary.css';

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Optional label so we can tell which region failed. */
  region?: string;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * Catches render-time errors in a subtree and shows a recoverable fallback
 * instead of unmounting the whole panel. UXP panels are long-lived, so a hard
 * crash would force the editor to reopen the panel — this prevents that.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  override state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    // Surfacing to the host console aids debugging inside Premiere's devtools.
    console.error(`[WebDock] ${this.props.region ?? 'app'} crashed:`, error, info.componentStack);
  }

  private reset = (): void => this.setState({ error: null });

  override render(): ReactNode {
    if (this.state.error) {
      return (
        <div className="wd-errorboundary" role="alert">
          <div className="wd-errorboundary__card wd-glass">
            <h2>Something went wrong</h2>
            <p>{this.state.error.message}</p>
            <button type="button" className="wd-errorboundary__btn" onClick={this.reset}>
              Try again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
