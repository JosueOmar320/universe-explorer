import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { charactersQueryOptions } from '../api/queries';
import type { CharacterListParams } from '../api/types';

/**
 * Paginated characters query.
 * - Keeps the previous page on screen while the next one loads (no layout jump).
 * - Prefetches the following page so "Next" usually renders instantly.
 */
export function useCharacters(params: CharacterListParams) {
  const queryClient = useQueryClient();
  const query = useQuery({ ...charactersQueryOptions(params), placeholderData: keepPreviousData });

  const { page, name, status, species, gender } = params;
  const totalPages = query.data?.totalPages ?? 0;
  const canPrefetch = !query.isPlaceholderData && page < totalPages;

  useEffect(() => {
    if (!canPrefetch) return;
    void queryClient.prefetchQuery(
      charactersQueryOptions({ page: page + 1, name, status, species, gender }),
    );
  }, [queryClient, canPrefetch, page, name, status, species, gender]);

  return query;
}
