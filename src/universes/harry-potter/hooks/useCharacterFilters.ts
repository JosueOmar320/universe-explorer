import { type SetUrlFilter, useUrlFilters } from '@/shared/hooks/useUrlFilters';
import { type CharacterFilters, FILTER_KEYS, parseCharacterFilters } from '../filters';

export type SetCharacterFilter = SetUrlFilter<CharacterFilters>;

/** Registry filters (`q`, `house`) kept in the URL. */
export function useCharacterFilters() {
  return useUrlFilters(FILTER_KEYS, parseCharacterFilters);
}
