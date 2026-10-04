import { useCallback } from 'react';
import { useSearchParams } from 'react-router';
import { PAGE_PARAM } from '@/shared/hooks/usePageParam';
import type { CharacterFilters } from '../api/types';
import { FILTER_KEYS, parseCharacterFilters } from '../filters';

type FilterKey = (typeof FILTER_KEYS)[number];

interface SetFilterOptions {
  /** Replace the history entry instead of pushing one (e.g. while typing a search). */
  replace?: boolean;
}

export type SetCharacterFilter = <K extends FilterKey>(
  key: K,
  value: CharacterFilters[K],
  options?: SetFilterOptions,
) => void;

/**
 * Character filters stored in the URL (`?name=rick&status=alive`), so filtered views are
 * shareable and survive reloads. Any filter change resets pagination to page 1.
 */
export function useCharacterFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = parseCharacterFilters(searchParams);
  const activeFilterCount = FILTER_KEYS.filter((key) => filters[key]).length;

  const setFilter = useCallback<SetCharacterFilter>(
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
        for (const key of FILTER_KEYS) next.delete(key);
        next.delete(PAGE_PARAM);
        return next;
      },
      { preventScrollReset: true },
    );
  }, [setSearchParams]);

  return { filters, activeFilterCount, setFilter, clearFilters };
}
