import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { paginate } from '@/shared/utils/paginate';
import { pokedexIndexQueryOptions, pokemonTypeQueryOptions } from '../api/queries';
import type { PokemonFilters } from '../filters';
import { filterPokedex } from '../utils/search';

export const POKEDEX_PAGE_SIZE = 24;

/**
 * One page of the (optionally filtered) Pokédex. Searching and paging run in memory on
 * the cached index; only a type filter needs data — that type's species list, also cached.
 */
export function usePokedexResults({ page, q, type }: PokemonFilters & { page: number }) {
  const indexQuery = useQuery(pokedexIndexQueryOptions());
  // Keeps the previous type's results on screen (dimmed) while a new type loads.
  const typeQuery = useQuery({
    ...pokemonTypeQueryOptions(type),
    placeholderData: keepPreviousData,
  });

  const index = indexQuery.data;
  const typeIds = type ? typeQuery.data?.pokedexIds : undefined;
  const isWaitingForType = type !== undefined && typeIds === undefined;

  const results = useMemo(() => {
    if (!index || isWaitingForType) return undefined;
    return paginate(filterPokedex(index, { query: q, ids: typeIds }), page, POKEDEX_PAGE_SIZE);
  }, [index, isWaitingForType, q, typeIds, page]);

  const failedQuery = indexQuery.isError
    ? indexQuery
    : type !== undefined && typeQuery.isError
      ? typeQuery
      : undefined;

  return {
    results,
    /** Size of the whole Pokédex, regardless of filters. */
    totalSpecies: index?.length,
    isPending: results === undefined && failedQuery === undefined,
    /** Offline: queries are paused and resume on reconnect. */
    isPaused: indexQuery.fetchStatus === 'paused' || typeQuery.fetchStatus === 'paused',
    error: failedQuery?.error,
    isRetrying: failedQuery?.isFetching ?? false,
    retry: () => void failedQuery?.refetch(),
    /** Showing the previous type's results while the selected one loads. */
    isUpdating: type !== undefined && typeQuery.isPlaceholderData,
  };
}
