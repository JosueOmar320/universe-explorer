import { pickOption } from '@/shared/utils/pickOption';
import { POKEMON_TYPES, type PokemonType } from './api/models';

export interface PokemonFilters {
  /** Name or Pokédex number. */
  q?: string;
  type?: PokemonType;
}

/** URL search params that hold Pokédex filters (`?q=pika&type=electric`). */
export const FILTER_KEYS = ['q', 'type'] as const satisfies readonly (keyof PokemonFilters)[];

/** Reads filters from the URL, dropping anything invalid (hand-edited or stale links). */
export function parsePokemonFilters(searchParams: URLSearchParams): PokemonFilters {
  return {
    q: searchParams.get('q')?.trim() || undefined,
    type: pickOption(searchParams.get('type'), POKEMON_TYPES),
  };
}
