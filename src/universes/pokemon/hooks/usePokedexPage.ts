import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { paginate } from '@/shared/utils/paginate';
import type { PokedexEntry } from '../api/models';
import { pokedexIndexQueryOptions } from '../api/queries';

export const POKEDEX_PAGE_SIZE = 24;

/**
 * One page of the Pokédex. The index is fetched once and cached; paging is local, so
 * changing page is instant and never hits the network.
 */
export function usePokedexPage(page: number) {
  // Stable `select` so TanStack Query only recomputes the page when it changes.
  const selectPage = useCallback(
    (index: PokedexEntry[]) => paginate(index, page, POKEDEX_PAGE_SIZE),
    [page],
  );

  return useQuery({ ...pokedexIndexQueryOptions(), select: selectPage });
}
