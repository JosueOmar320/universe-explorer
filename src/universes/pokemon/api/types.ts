/* PokéAPI v2 response shapes (only the fields we use) — https://pokeapi.co/docs/v2 */

export interface NamedApiResource {
  name: string;
  url: string;
}

export interface ApiList<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

interface Localized {
  language: NamedApiResource;
}

export interface PokemonDto {
  id: number;
  name: string;
  /** Decimetres. */
  height: number;
  /** Hectograms. */
  weight: number;
  types: { slot: number; type: NamedApiResource }[];
  stats: { base_stat: number; stat: NamedApiResource }[];
  abilities: { is_hidden: boolean; slot: number; ability: NamedApiResource }[];
  sprites: { other?: { 'official-artwork'?: { front_default: string | null } } };
}

export interface PokemonSpeciesDto {
  id: number;
  name: string;
  names: (Localized & { name: string })[];
  genera: (Localized & { genus: string })[];
  flavor_text_entries: (Localized & { flavor_text: string; version: NamedApiResource })[];
  generation: NamedApiResource;
  is_legendary: boolean;
  is_mythical: boolean;
}

export interface PokemonTypeDto {
  name: string;
  names: (Localized & { name: string })[];
  pokemon: { slot: number; pokemon: NamedApiResource }[];
}
