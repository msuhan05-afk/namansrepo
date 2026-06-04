import { useExtract } from './useExtract';
import { useTheme } from './useTheme';
import { useCopy } from './components/useCopy';
import { Results } from './components/Results';
import { toFigmaTokens } from '../lib/figma';
import {
  SunIcon,
  MoonIcon,
  SparkIcon,
  DownloadIcon,
  RefreshIcon,
} from './components/Icons';

export function App() {
  const { theme, toggle } = useTheme();
  const { status, data, error, extract } = useExtract();
  const exportCopy = useCopy(1400);

  function downloadJson() {
    if (!data) return;
    const tokens = toFigmaTokens(data);
    const blob = new Blob([JSON.stringify(tokens, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const safe =
      (data.source.title || 'design-dna')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 40) || 'design-dna';
    const a = document.createElement('a');
    a.href = url;
    a.download = `${safe}-design-dna.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div
      className="flex min-h-[480px] flex-col bg-gradient-to-b from-ink-50 to-white
        text-ink-800 dark:from-ink-900 dark:to-ink-800 dark:text-ink-50"
    >
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between gap-2 border-b
        border-ink-200/70 bg-white/70 px-4 py-3 backdrop-blur-xl
        dark:border-ink-700/60 dark:bg-ink-900/70">
        <div className="flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br
            from-accent to-purple-500 text-white shadow-sm">
            <SparkIcon width={15} height={15} />
          </div>
          <div className="leading-tight">
            <h1 className="text-sm font-semibold tracking-tight">Design DNA</h1>
            <p className="text-[10px] text-ink-400">Extract any site’s design system</p>
          </div>
        </div>
        <button
          type="button"
          onClick={toggle}
          title="Toggle theme"
          className="grid h-8 w-8 place-items-center rounded-lg text-ink-500 transition
            hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-700"
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>
      </header>

      <main className="flex-1 px-4 py-4">
        {status === 'idle' && <Idle onExtract={extract} />}
        {status === 'loading' && <Loading />}
        {status === 'error' && <ErrorState message={error} onRetry={extract} />}
        {status === 'done' && data && <Results data={data} />}
      </main>

      {/* Footer actions */}
      {status === 'done' && data && (
        <footer className="sticky bottom-0 flex items-center gap-2 border-t border-ink-200/70
          bg-white/80 px-4 py-3 backdrop-blur-xl dark:border-ink-700/60 dark:bg-ink-900/80">
          <button type="button" onClick={extract} className="dna-btn-ghost flex-none" title="Re-scan">
            <RefreshIcon width={15} height={15} />
          </button>
          <button
            type="button"
            onClick={() => {
              const tokens = toFigmaTokens(data);
              exportCopy.copy(JSON.stringify(tokens, null, 2));
            }}
            className="dna-btn-ghost flex-1"
          >
            {exportCopy.copied ? 'Copied JSON ✓' : 'Copy JSON'}
          </button>
          <button type="button" onClick={downloadJson} className="dna-btn-primary flex-1">
            <DownloadIcon width={15} height={15} />
            Figma JSON
          </button>
        </footer>
      )}
    </div>
  );
}

function Idle({ onExtract }: { onExtract: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 py-10 text-center
      animate-scale-in">
      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br
        from-accent to-purple-500 text-white shadow-glass">
        <SparkIcon width={30} height={30} />
      </div>
      <div className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight">Decode this page’s design</h2>
        <p className="mx-auto max-w-[260px] text-xs leading-relaxed text-ink-400">
          Extract colors, fonts and button styles into a tidy, Figma-ready design system.
        </p>
      </div>
      <button type="button" onClick={onExtract} className="dna-btn-primary px-5 py-2.5">
        <SparkIcon width={16} height={16} />
        Analyze page
      </button>
    </div>
  );
}

function Loading() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 py-16 text-center">
      <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-ink-200
        border-t-accent dark:border-ink-700 dark:border-t-accent" />
      <p className="text-xs text-ink-400">Reading the page’s DNA…</p>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string | null; onRetry: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 py-12 text-center
      animate-fade-in">
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-red-50 text-red-500
        dark:bg-red-500/10">
        <span className="text-xl">!</span>
      </div>
      <p className="max-w-[280px] text-xs leading-relaxed text-ink-500 dark:text-ink-300">
        {message ?? 'Something went wrong.'}
      </p>
      <button type="button" onClick={onRetry} className="dna-btn-ghost">
        <RefreshIcon width={15} height={15} />
        Try again
      </button>
    </div>
  );
}
