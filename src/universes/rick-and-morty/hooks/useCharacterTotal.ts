import { useQuery } from '@tanstack/react-query';
import { charactersQueryOptions } from '../api/queries';

/**
 * Size of the whole archive, independent of the active filters. Shares the cache entry
 * of the unfiltered first page, so it usually costs no extra request.
 */
export function useCharacterTotal(): number | undefined {
  const { data } = useQuery({
    ...charactersQueryOptions({ page: 1 }),
    select: (page) => page.totalCount,
  });
  return data;
}
