import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { paginate } from '@/shared/utils/paginate';
import { peopleQueryOptions } from '../api/queries';

export const PEOPLE_PAGE_SIZE = 12;

/** One page of people, paginated locally over the cached collection. */
export function usePeopleResults({ page }: { page: number }) {
  const query = useQuery(peopleQueryOptions());
  const people = query.data;

  const results = useMemo(
    () => (people ? paginate(people, page, PEOPLE_PAGE_SIZE) : undefined),
    [people, page],
  );

  return {
    results,
    totalPeople: people?.length,
    isPending: query.isPending,
    isPaused: query.fetchStatus === 'paused',
    error: query.error,
    isRetrying: query.isFetching,
    retry: () => void query.refetch(),
  };
}
