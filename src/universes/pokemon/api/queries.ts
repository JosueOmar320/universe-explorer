import { queryOptions, skipToken } from '@tanstack/react-query';
import type { PokemonType } from './models';
import { getPokedexIndex, getPokemon, getPokemonSpecies, getPokemonType } from './pokeApi';

/**
 * Game data never changes during a session, so these queries never go stale: once a
 * Pokémon is loaded, revisiting it is free.
 */
const STATIC_DATA = { staleTime: Infinity, gcTime: 60 * 60 * 1000 } as const;

export const pokemonKeys = {
  all: ['pokemon'] as const,
  index: () => [...pokemonKeys.all, 'index'] as const,
  detail: (id: number) => [...pokemonKeys.all, 'detail', id] as const,
  species: (id: number) => [...pokemonKeys.all, 'species', id] as const,
  type: (type: PokemonType | undefined) => [...pokemonKeys.all, 'type', type] as const,
};

export function pokedexIndexQueryOptions() {
  return queryOptions({
    queryKey: pokemonKeys.index(),
    queryFn: ({ signal }) => getPokedexIndex(signal),
    ...STATIC_DATA,
  });
}

export function pokemonQueryOptions(id: number) {
  return queryOptions({
    queryKey: pokemonKeys.detail(id),
    queryFn: ({ signal }) => getPokemon(id, signal),
    ...STATIC_DATA,
  });
}

export function pokemonSpeciesQueryOptions(id: number) {
  return queryOptions({
    queryKey: pokemonKeys.species(id),
    queryFn: ({ signal }) => getPokemonSpecies(id, signal),
    ...STATIC_DATA,
  });
}

/** Without a type the query is skipped (e.g. no type filter selected). */
export function pokemonTypeQueryOptions(type: PokemonType | undefined) {
  return queryOptions({
    queryKey: pokemonKeys.type(type),
    queryFn: type ? ({ signal }) => getPokemonType(type, signal) : skipToken,
    ...STATIC_DATA,
  });
}
