import { apiConfig, assetConfig } from '@/config/apis';
import { createApiClient } from '@/shared/api/httpClient';
import { getIdFromResourceUrl } from '@/shared/api/resourceUrl';
import { pickOption } from '@/shared/utils/pickOption';
import { normalizeGameText } from '../utils/localized';
import {
  type LocalizedText,
  type Pokemon,
  type PokedexEntry,
  type PokemonSpecies,
  type PokemonType,
  type PokemonTypeDetails,
  POKEMON_TYPES,
  STAT_NAMES,
} from './models';
import type {
  ApiList,
  NamedApiResource,
  PokemonDto,
  PokemonSpeciesDto,
  PokemonTypeDto,
} from './types';

const client = createApiClient(apiConfig.pokemon);

/** Higher than the number of species, so the whole index comes back in one request. */
const INDEX_LIMIT = 10_000;

/** Alternate forms (Mega, Gigantamax, regional…) use ids from 10001 up. */
const FIRST_ALTERNATE_FORM_ID = 10_001;

/**
 * 96px pixel sprite (~1–7 kB). Used in lists: the official artwork weighs 100–200 kB per
 * image, which would mean several megabytes per page of results.
 */
export function getSpriteUrl(pokedexId: number): string {
  return `${assetConfig.pokemonSpritesBaseUrl}/${pokedexId}.png`;
}

/** High-resolution official artwork, for single-Pokémon views. */
export function getArtworkUrl(pokedexId: number): string {
  return `${assetConfig.pokemonSpritesBaseUrl}/other/official-artwork/${pokedexId}.png`;
}

function toLocalizedText<T extends { language: NamedApiResource }>(
  entries: readonly T[],
  getText: (entry: T) => string,
): LocalizedText {
  const text: LocalizedText = {};
  // If a language appears more than once, the last entry wins.
  for (const entry of entries) text[entry.language.name] = getText(entry);
  return text;
}

function toPokemonTypes(types: PokemonDto['types']): PokemonType[] {
  return [...types]
    .sort((a, b) => a.slot - b.slot)
    .map(({ type }) => pickOption(type.name, POKEMON_TYPES))
    .filter((type): type is PokemonType => type !== undefined);
}

/**
 * Every species in National Pokédex order. PokéAPI has no search endpoint, so the app
 * downloads this small index once (~1k entries) and searches/paginates it locally.
 */
export async function getPokedexIndex(signal?: AbortSignal): Promise<PokedexEntry[]> {
  const response = await client.get<ApiList<NamedApiResource>>('pokemon-species', {
    params: { limit: INDEX_LIMIT },
    signal,
  });

  return response.results
    .map(({ name, url }) => ({ id: getIdFromResourceUrl(url), name }))
    .filter((entry): entry is PokedexEntry => entry.id !== undefined)
    .sort((a, b) => a.id - b.id);
}

/** Battle data of a Pokémon's default form. Throws `HttpError` 404 for unknown ids. */
export async function getPokemon(id: number, signal?: AbortSignal): Promise<Pokemon> {
  const dto = await client.get<PokemonDto>(`pokemon/${id}`, { signal });

  return {
    id: dto.id,
    name: dto.name,
    types: toPokemonTypes(dto.types),
    height: dto.height,
    weight: dto.weight,
    stats: dto.stats.flatMap(({ stat, base_stat }) => {
      const name = pickOption(stat.name, STAT_NAMES);
      return name ? [{ name, value: base_stat }] : [];
    }),
    abilities: [...dto.abilities]
      .sort((a, b) => a.slot - b.slot)
      .map(({ ability, is_hidden }) => ({ name: ability.name, isHidden: is_hidden })),
    artworkUrl: dto.sprites.other?.['official-artwork']?.front_default ?? getArtworkUrl(dto.id),
  };
}

/** Localized names, category ("genus") and Pokédex text. */
export async function getPokemonSpecies(id: number, signal?: AbortSignal): Promise<PokemonSpecies> {
  const dto = await client.get<PokemonSpeciesDto>(`pokemon-species/${id}`, { signal });

  return {
    id: dto.id,
    names: toLocalizedText(dto.names, (entry) => entry.name),
    genus: toLocalizedText(dto.genera, (entry) => entry.genus),
    // Sorted by game version so each language keeps its most recent Pokédex entry.
    flavorText: toLocalizedText(
      [...dto.flavor_text_entries].sort(
        (a, b) =>
          (getIdFromResourceUrl(a.version.url) ?? 0) - (getIdFromResourceUrl(b.version.url) ?? 0),
      ),
      (entry) => normalizeGameText(entry.flavor_text),
    ),
    generation: getIdFromResourceUrl(dto.generation.url) ?? 0,
    isLegendary: dto.is_legendary,
    isMythical: dto.is_mythical,
  };
}

/** Localized type name and the species that have it (used by the type filter). */
export async function getPokemonType(
  type: PokemonType,
  signal?: AbortSignal,
): Promise<PokemonTypeDetails> {
  const dto = await client.get<PokemonTypeDto>(`type/${type}`, { signal });

  const pokedexIds = dto.pokemon
    .map(({ pokemon }) => getIdFromResourceUrl(pokemon.url))
    .filter((id): id is number => id !== undefined && id < FIRST_ALTERNATE_FORM_ID)
    .sort((a, b) => a - b);

  return {
    name: type,
    names: toLocalizedText(dto.names, (entry) => entry.name),
    pokedexIds,
  };
}
