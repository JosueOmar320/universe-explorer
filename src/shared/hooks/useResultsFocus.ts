import { useCallback, useRef } from 'react';

/**
 * For paginated results: after changing page, bring the results heading into view and
 * move focus there, so keyboard and screen reader users continue from the new results.
 * The heading needs `tabIndex={-1}` to be focusable.
 */
export function useResultsFocus<T extends HTMLElement = HTMLHeadingElement>() {
  const resultsRef = useRef<T>(null);

  const focusResults = useCallback(() => {
    const target = resultsRef.current;
    target?.focus({ preventScroll: true });
    target?.scrollIntoView({ block: 'start' });
  }, []);

  return { resultsRef, focusResults };
}
