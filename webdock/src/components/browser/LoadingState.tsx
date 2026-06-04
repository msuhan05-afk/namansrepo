/**
 * Slim top-edge progress shimmer shown while a page is loading. Intentionally
 * non-blocking — the previous page stays visible underneath, like a real
 * browser, so the panel never flashes empty.
 */
export function LoadingBar() {
  return (
    <div className="wd-loadingbar" role="progressbar" aria-label="Loading page">
      <span className="wd-loadingbar__indeterminate" />
    </div>
  );
}
