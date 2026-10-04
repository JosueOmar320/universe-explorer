import { type UseQueryResult, useQueries } from '@tanstack/react-query';
import { POKEMON_TYPES, type PokemonType, type PokemonTypeDetails } from '../api/models';
import { pokemonTypeQueryOptions } from '../api/queries';

export type TypesByPokedexId = ReadonlyMap<number, PokemonType[]>;

// Module-level, so TanStack Query can keep the combined result between renders.
function combine(results: UseQueryResult<PokemonTypeDetails>[]): TypesByPokedexId | undefined {
  if (results.some(({ isPending }) => isPending)) return undefined;

  const slotted = new Map<number, { type: PokemonType; slot: number }[]>();
  for (const { data } of results) {
    if (!data) continue; // A failed type list: those badges are missing, the rest still show.
    for (const id of data.pokedexIds) {
      const types = slotted.get(id) ?? [];
      types.push({ type: data.name, slot: data.slots[id] ?? 1 });
      slotted.set(id, types);
    }
  }
  return new Map(
    [...slotted].map(([id, types]) => [
      id,
      types.sort((a, b) => a.slot - b.slot).map(({ type }) => type),
    ]),
  );
}

/**
 * The types of every species, from the 18 type lists (~20 kB of JSON each, cached for the
 * session and shared with the type filter). The alternative, one `/pokemon/<id>` per card,
 * means ~300 kB of JSON each: parsing 24 of them blocked the main thread for hundreds of
 * milliseconds on slower devices. `undefined` while loading.
 */
export function usePokedexTypes(): TypesByPokedexId | undefined {
  return useQueries({
    queries: POKEMON_TYPES.map((type) => pokemonTypeQueryOptions(type)),
    combine,
  });
}
