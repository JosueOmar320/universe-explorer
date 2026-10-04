import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import type { CharacterListParams } from '../api/models';
import { charactersQueryOptions } from '../api/queries';

/**
 * One page of characters from the server. PotterDB takes ~1 s per request, so the
 * previous page stays on screen while the next loads, and the following page is
 * prefetched so "Next" is usually instant.
 */
export function useCharacters(params: CharacterListParams) {
  const queryClient = useQueryClient();
  const query = useQuery({ ...charactersQueryOptions(params), placeholderData: keepPreviousData });

  const { page, name, house, houses } = params;
  const totalPages = query.data?.totalPages ?? 0;
  const canPrefetch = !query.isPlaceholderData && page < totalPages;

  useEffect(() => {
    if (!canPrefetch) return;
    void queryClient.prefetchQuery(charactersQueryOptions({ page: page + 1, name, house, houses }));
  }, [queryClient, canPrefetch, page, name, house, houses]);

  return query;
}
