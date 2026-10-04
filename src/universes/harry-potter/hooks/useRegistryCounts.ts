import { useQueries } from '@tanstack/react-query';
import { HOGWARTS_HOUSES } from '../api/models';
import { charactersQueryOptions } from '../api/queries';

/**
 * Students per house, total students and the size of the whole registry, for the hero.
 * Each count is the first page of that filter, so selecting it later is already cached.
 */
export function useRegistryCounts() {
  const houseCounts = useQueries({
    queries: HOGWARTS_HOUSES.map((house) => ({
      ...charactersQueryOptions({ page: 1, house }),
      select: (page: { totalCount: number }) => page.totalCount,
    })),
  });
  // First pages of the default listing (students) and of "everyone", also used by the list.
  const [students, everyone] = useQueries({
    queries: [
      charactersQueryOptions({ page: 1, houses: HOGWARTS_HOUSES }),
      charactersQueryOptions({ page: 1 }),
    ].map((options) => ({
      ...options,
      select: (page: { totalCount: number }) => page.totalCount,
    })),
  });

  return {
    houses: HOGWARTS_HOUSES.map((house, index) => ({ house, count: houseCounts[index]?.data })),
    students: students?.data,
    everyone: everyone?.data,
  };
}
