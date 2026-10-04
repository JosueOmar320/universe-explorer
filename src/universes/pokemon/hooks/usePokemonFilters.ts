import { type SetUrlFilter, useUrlFilters } from '@/shared/hooks/useUrlFilters';
import { FILTER_KEYS, type PokemonFilters, parsePokemonFilters } from '../filters';

export type SetPokemonFilter = SetUrlFilter<PokemonFilters>;

/** Pokédex filters (`q`, `type`) kept in the URL. */
export function usePokemonFilters() {
  return useUrlFilters(FILTER_KEYS, parsePokemonFilters);
}
