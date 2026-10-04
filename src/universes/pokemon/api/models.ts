/* UI-facing models: normalized and much smaller than the raw PokéAPI payloads. */

/** The 18 battle types. PokéAPI also exposes non-battle ones (`unknown`, `shadow`, `stellar`). */
export const POKEMON_TYPES = [
  'normal',
  'fire',
  'water',
  'grass',
  'electric',
  'ice',
  'fighting',
  'poison',
  'ground',
  'flying',
  'psychic',
  'bug',
  'rock',
  'ghost',
  'dragon',
  'dark',
  'steel',
  'fairy',
] as const;

export type PokemonType = (typeof POKEMON_TYPES)[number];

export const STAT_NAMES = [
  'hp',
  'attack',
  'defense',
  'special-attack',
  'special-defense',
  'speed',
] as const;

export type StatName = (typeof STAT_NAMES)[number];

/** Text in several languages, keyed by PokéAPI language code (`en`, `es`, `ja`…). */
export type LocalizedText = Partial<Record<string, string>>;

/** One row of the Pokédex index: enough to list, search and paginate. */
export interface PokedexEntry {
  /** National Pokédex number. */
  id: number;
  name: string;
}

export interface Pokemon {
  id: number;
  name: string;
  types: PokemonType[];
  /** Decimetres, as provided by the API. */
  height: number;
  /** Hectograms, as provided by the API. */
  weight: number;
  stats: { name: StatName; value: number }[];
  abilities: { name: string; isHidden: boolean }[];
  artworkUrl: string;
}

export interface PokemonSpecies {
  id: number;
  names: LocalizedText;
  genus: LocalizedText;
  /** Latest Pokédex entry per language. */
  flavorText: LocalizedText;
  generation: number;
  isLegendary: boolean;
  isMythical: boolean;
}

export interface PokemonTypeDetails {
  name: PokemonType;
  names: LocalizedText;
  /** Pokédex numbers of the species with this type (alternate forms excluded). */
  pokedexIds: number[];
  /** For each of those species, whether this is its first or second type (1 or 2). */
  slots: Partial<Record<number, number>>;
}
