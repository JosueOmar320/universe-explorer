import { type RefObject, useEffect, useRef } from 'react';
import { useLocation } from 'react-router';

/**
 * Moves focus to `targetRef` (typically `<main tabIndex={-1}>`) when the pathname changes.
 *
 * In a SPA the link the user activated usually disappears on navigation, dropping focus to
 * `<body>`: keyboard users restart from the top and screen readers announce nothing.
 * Query-string changes (paging, filters) are left alone — those views manage focus themselves.
 */
export function useFocusOnPathChange(targetRef: RefObject<HTMLElement | null>) {
  const { pathname } = useLocation();
  const previousPathname = useRef(pathname);

  useEffect(() => {
    if (previousPathname.current === pathname) return;
    previousPathname.current = pathname;
    // Scroll position is handled by <ScrollRestoration />.
    targetRef.current?.focus({ preventScroll: true });
  }, [pathname, targetRef]);
}
