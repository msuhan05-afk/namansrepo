import { useEffect, useState } from 'react';

/**
 * Returns a debounced copy of `value` that only updates after `delay` ms of
 * quiet. Used by the smart search bar to avoid recomputing suggestions on
 * every keystroke.
 */
export function useDebouncedValue<T>(value: T, delay = 140): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
