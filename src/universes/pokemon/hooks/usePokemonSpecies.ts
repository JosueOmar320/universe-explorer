import { useQuery } from '@tanstack/react-query';
import { pokemonSpeciesQueryOptions } from '../api/queries';

/** Localized names, category and Pokédex entry of a species. */
export function usePokemonSpecies(id: number) {
  return useQuery(pokemonSpeciesQueryOptions(id));
}
