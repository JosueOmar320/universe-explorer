import { type SetUrlFilter, useUrlFilters } from '@/shared/hooks/useUrlFilters';
import type { CharacterFilters } from '../api/types';
import { FILTER_KEYS, parseCharacterFilters } from '../filters';

export type SetCharacterFilter = SetUrlFilter<CharacterFilters>;

/** Character filters (`name`, `status`, `gender`, `species`) kept in the URL. */
export function useCharacterFilters() {
  return useUrlFilters(FILTER_KEYS, parseCharacterFilters);
}
