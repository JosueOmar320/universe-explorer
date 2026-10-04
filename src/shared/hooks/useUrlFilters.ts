import { useCallback } from 'react';
import { useSearchParams } from 'react-router';
import { PAGE_PARAM } from './usePageParam';

interface SetFilterOptions {
  /** Replace the history entry instead of pushing one (e.g. while typing a search). */
  replace?: boolean;
}

export type SetUrlFilter<F> = <K extends keyof F & string>(
  key: K,
  value: F[K],
  options?: SetFilterOptions,
) => void;

/**
 * Filters stored in the URL (`?name=rick&status=alive`), so filtered views are shareable,
 * survive reloads and work with the back button. Any change resets pagination to page 1.
 *
 * Each feature supplies its filter keys and a `parse` function that validates raw params.
 * Both should be module-level constants so the returned callbacks stay stable.
 */
export function useUrlFilters<F extends Partial<Record<keyof F, string>>>(
  keys: readonly (keyof F & string)[],
  parse: (searchParams: URLSearchParams) => F,
) {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = parse(searchParams);
  const activeFilterCount = keys.filter((key) => filters[key]).length;

  const setFilter = useCallback<SetUrlFilter<F>>(
    (key, value, options) => {
      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current);
          if (value) next.set(key, value);
          else next.delete(key);
          next.delete(PAGE_PARAM);
          return next;
        },
        { replace: options?.replace, preventScrollReset: true },
      );
    },
    [setSearchParams],
  );

  const clearFilters = useCallback(() => {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        for (const key of keys) next.delete(key);
        next.delete(PAGE_PARAM);
        return next;
      },
      { preventScrollReset: true },
    );
  }, [keys, setSearchParams]);

  return { filters, activeFilterCount, setFilter, clearFilters };
}
