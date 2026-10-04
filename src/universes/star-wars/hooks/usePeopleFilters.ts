import { type SetUrlFilter, useUrlFilters } from '@/shared/hooks/useUrlFilters';
import { FILTER_KEYS, type PeopleFilters, parsePeopleFilters } from '../filters';

export type SetPeopleFilter = SetUrlFilter<PeopleFilters>;

/** People filters (`q`, `episode`, `species`) kept in the URL. */
export function usePeopleFilters() {
  return useUrlFilters(FILTER_KEYS, parsePeopleFilters);
}
