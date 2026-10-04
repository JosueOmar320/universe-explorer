import { useQuery } from '@tanstack/react-query';
import { pokemonQueryOptions } from '../api/queries';

/** Battle data of one Pokémon (~300 kB of JSON: detail pages only, never per card). */
export function usePokemon(id: number) {
  return useQuery(pokemonQueryOptions(id));
}
