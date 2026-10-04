import { useQuery } from '@tanstack/react-query';
import { pokemonQueryOptions } from '../api/queries';

/** Battle data of one Pokémon. Cards share this cache, so each Pokémon is fetched once. */
export function usePokemon(id: number) {
  return useQuery(pokemonQueryOptions(id));
}
