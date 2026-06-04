import { useEffect, useMemo, useRef, useState } from 'react';
import { Icon } from '@/components/common/Icon';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { getSuggestions, looksLikeUrl, normalizeUrl } from '@/features/search/searchEngine';
import { SERVICE_MAP } from '@/data/services';
import type { SearchSuggestion } from '@/types';
import './search.css';

interface SmartSearchBarProps {
  /** Current page URL, shown as the resting value. */
  currentUrl: string;
  /** Navigate to a resolved URL, attributing it to a service when known. */
  onNavigate: (url: string, serviceId: string | null) => void;
}

/**
 * Raycast-style omnibox. Typing a query fans out quick suggestions across
 * Google / YouTube / ChatGPT / Pexels etc.; typing a URL offers a direct "Go
 * to". Fully keyboard-driven (↑ ↓ Enter Esc).
 */
export function SmartSearchBar({ currentUrl, onNavigate }: SmartSearchBarProps) {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debounced = useDebouncedValue(value, 120);
  const suggestions = useMemo<SearchSuggestion[]>(
    () => getSuggestions(debounced),
    [debounced],
  );

  const open = focused && value.trim().length > 0 && suggestions.length > 0;

  // Clamp the keyboard highlight whenever the list changes.
  useEffect(() => {
    setHighlight(0);
  }, [debounced]);

  const commit = (suggestion?: SearchSuggestion) => {
    const chosen = suggestion ?? suggestions[highlight];
    if (chosen) {
      onNavigate(chosen.url, chosen.serviceId);
    } else if (looksLikeUrl(value)) {
      onNavigate(normalizeUrl(value), 'custom');
    } else {
      // No suggestion (shouldn't happen) — default to Google.
      const google = SERVICE_MAP['google'];
      onNavigate(google.searchTemplate!.replace('%s', encodeURIComponent(value)), 'google');
    }
    setValue('');
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      commit();
    } else if (e.key === 'Escape') {
      setValue('');
      inputRef.current?.blur();
    }
  };

  return (
    <div className="wd-searchbar">
      <div className={`wd-searchbar__field wd-glass ${open ? 'is-open' : ''}`}>
        <Icon name="search" size={16} style={{ opacity: 0.6, flex: 'none' }} />
        <input
          ref={inputRef}
          className="wd-searchbar__input"
          type="text"
          spellCheck={false}
          placeholder="Search anything…"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (blurTimer.current) clearTimeout(blurTimer.current);
            setFocused(true);
          }}
          onBlur={() => {
            // Delay so a click on a suggestion registers before we close.
            blurTimer.current = setTimeout(() => setFocused(false), 120);
          }}
          aria-label="Smart search"
          aria-expanded={open}
          aria-autocomplete="list"
        />
        {value && (
          <button
            type="button"
            className="wd-searchbar__clear"
            aria-label="Clear search"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              setValue('');
              inputRef.current?.focus();
            }}
          >
            <Icon name="close" size={14} />
          </button>
        )}
      </div>

      {!value && (
        <span className="wd-searchbar__host" title={currentUrl}>
          {hostnameOf(currentUrl)}
        </span>
      )}

      {open && (
        <ul className="wd-suggestions wd-glass" role="listbox">
          {suggestions.map((s, i) => (
            <li key={s.id} role="option" aria-selected={i === highlight}>
              <button
                type="button"
                className={`wd-suggestion ${i === highlight ? 'is-active' : ''}`}
                onMouseEnter={() => setHighlight(i)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => commit(s)}
              >
                <span className="wd-suggestion__icon">
                  <Icon name={s.icon} size={16} />
                </span>
                <span className="wd-suggestion__label">{s.label}</span>
                {s.serviceId !== 'custom' && (
                  <span className="wd-suggestion__query">{debounced.trim()}</span>
                )}
                <Icon name="forward" size={14} style={{ opacity: 0.4 }} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Pull a readable hostname out of a URL for the resting label. */
function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}
