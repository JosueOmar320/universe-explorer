import { useCallback } from 'react';
import { useSearchParams } from 'react-router';

const PAGE_PARAM = 'page';

function parsePage(value: string | null): number {
  const page = Number(value);
  return Number.isInteger(page) && page >= 1 ? page : 1;
}

/**
 * Current page stored in the URL (`?page=3`), so pages are shareable and the
 * back button works. Invalid values fall back to page 1.
 */
export function usePageParam() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parsePage(searchParams.get(PAGE_PARAM));

  const setPage = useCallback(
    (nextPage: number) => {
      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current);
          if (nextPage <= 1) next.delete(PAGE_PARAM);
          else next.set(PAGE_PARAM, String(nextPage));
          return next;
        },
        // The page decides where to move focus/scroll after paging.
        { preventScrollReset: true },
      );
    },
    [setSearchParams],
  );

  return { page, setPage };
}
