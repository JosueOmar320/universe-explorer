import { apiConfig } from '@/config/apis';
import { POKEMON_TYPES, type PokemonType } from '../api/models';
import type { NamedApiResource, PokemonDto, PokemonSpeciesDto, PokemonTypeDto } from '../api/types';

const API = apiConfig.pokemon.baseUrl;

const resource = (path: string, name: string): NamedApiResource => ({
  name,
  url: `${API}/${path}/`,
});

const language = (code: string) => resource(`language/${code === 'en' ? 9 : 7}`, code);

/** First 30 species of the National Pokédex: more than one page of results. */
export const SPECIES_NAMES = [
  'bulbasaur', 'ivysaur', 'venusaur', 'charmander', 'charmeleon', 'charizard',
  'squirtle', 'wartortle', 'blastoise', 'caterpie', 'metapod', 'butterfree',
  'weedle', 'kakuna', 'beedrill', 'pidgey', 'pidgeotto', 'pidgeot', 'rattata',
  'raticate', 'spearow', 'fearow', 'ekans', 'arbok', 'pikachu', 'raichu',
  'sandshrew', 'sandslash', 'nidoran-f', 'nidorina',
]; // prettier-ignore

export const speciesIndex: NamedApiResource[] = SPECIES_NAMES.map((name, index) =>
  resource(`pokemon-species/${index + 1}`, name),
);

export function createPokemonDto(
  id: number,
  name: string,
  types: (PokemonType | 'stellar')[],
): PokemonDto {
  return {
    id,
    name,
    height: 4,
    weight: 60,
    types: types.map((type, index) => ({ slot: index + 1, type: resource(`type/${type}`, type) })),
    stats: [
      { base_stat: 35, stat: resource('stat/1', 'hp') },
      { base_stat: 55, stat: resource('stat/2', 'attack') },
      { base_stat: 40, stat: resource('stat/3', 'defense') },
      { base_stat: 50, stat: resource('stat/4', 'special-attack') },
      { base_stat: 50, stat: resource('stat/5', 'special-defense') },
      { base_stat: 90, stat: resource('stat/6', 'speed') },
    ],
    abilities: [
      { is_hidden: true, slot: 3, ability: resource('ability/31', 'lightning-rod') },
      { is_hidden: false, slot: 1, ability: resource('ability/9', 'static') },
    ],
    sprites: {
      other: { 'official-artwork': { front_default: `https://img.example.test/${id}.png` } },
    },
  };
}

const TYPES_BY_ID: Partial<Record<number, PokemonType[]>> = {
  1: ['grass', 'poison'],
  2: ['grass', 'poison'],
  3: ['grass', 'poison'],
  4: ['fire'],
  5: ['fire'],
  6: ['fire', 'flying'],
  7: ['water'],
  25: ['electric'],
  26: ['electric'],
};

/** Every species of the index has battle data; types default to `normal`. */
export const pokemonDtos: Record<number, PokemonDto> = Object.fromEntries(
  SPECIES_NAMES.map((name, index) => {
    const id = index + 1;
    return [id, createPokemonDto(id, name, TYPES_BY_ID[id] ?? ['normal'])];
  }),
);

export const speciesDtos: Record<number, PokemonSpeciesDto> = {
  25: {
    id: 25,
    name: 'pikachu',
    names: [
      { name: 'Pikachu', language: language('en') },
      { name: 'Pikachu', language: language('es') },
    ],
    genera: [
      { genus: 'Mouse Pokémon', language: language('en') },
      { genus: 'Pokémon Ratón', language: language('es') },
    ],
    // Deliberately out of order: the newest game (shield, 34) must win.
    flavor_text_entries: [
      { flavor_text: 'Newest\nentry.', language: language('en'), version: resource('version/34', 'shield') },
      { flavor_text: 'Oldest entry.', language: language('en'), version: resource('version/1', 'red') },
      { flavor_text: 'Entrada\fmás reciente.', language: language('es'), version: resource('version/34', 'shield') },
    ],
    generation: resource('generation/1', 'generation-i'),
    is_legendary: false,
    is_mythical: false,
  },
}; // prettier-ignore

const SPANISH_TYPE_NAMES: Partial<Record<PokemonType, string>> = {
  electric: 'Eléctrico',
  fire: 'Fuego',
};

/** Every type, with members derived from the Pokémon fixtures (so both always agree). */
export const typeDtos: Partial<Record<PokemonType, PokemonTypeDto>> = Object.fromEntries(
  POKEMON_TYPES.map((type) => {
    const members = Object.values(pokemonDtos).filter((dto) =>
      dto.types.some((slot) => slot.type.name === type),
    );
    const spanishName = SPANISH_TYPE_NAMES[type];
    return [
      type,
      {
        name: type,
        names: [
          { name: type.charAt(0).toUpperCase() + type.slice(1), language: language('en') },
          ...(spanishName ? [{ name: spanishName, language: language('es') }] : []),
        ],
        pokemon: [
          ...members.map((dto) => ({
            slot: dto.types.find((slot) => slot.type.name === type)?.slot ?? 1,
            pokemon: resource(`pokemon/${dto.id}`, dto.name),
          })),
          // Alternate form: must not be listed as a separate species.
          ...(type === 'electric'
            ? [{ slot: 1, pokemon: resource('pokemon/10080', 'pikachu-rock-star') }]
            : []),
        ],
      },
    ];
  }),
);
