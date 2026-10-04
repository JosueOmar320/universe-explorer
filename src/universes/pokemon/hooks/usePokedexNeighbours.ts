import { useQuery } from '@tanstack/react-query';
import type { PokedexEntry } from '../api/models';
import { pokedexIndexQueryOptions } from '../api/queries';

/** Previous and next species in the National Pokédex, from the cached index. */
export function usePokedexNeighbours(id: number) {
  const { data: index } = useQuery(pokedexIndexQueryOptions());
  const position = index?.findIndex((entry) => entry.id === id) ?? -1;

  const previous: PokedexEntry | undefined = position > 0 ? index?.[position - 1] : undefined;
  const next: PokedexEntry | undefined = position >= 0 ? index?.[position + 1] : undefined;
  return { previous, next };
}
