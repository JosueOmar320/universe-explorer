import { apiConfig } from '@/config/apis';
import { createApiClient } from '@/shared/api/httpClient';
import { getIdFromResourceUrl } from '@/shared/api/resourceUrl';
import { parseSwapiNumber, parseSwapiText } from '../utils/swapiValues';
import type { Craft, Film, Person, Planet, Species } from './models';
import type { FilmDto, PersonDto, PlanetDto, SpeciesDto, StarshipDto, VehicleDto } from './types';

const client = createApiClient(apiConfig.starWars);

function toIds(urls: readonly string[]): number[] {
  return urls.map(getIdFromResourceUrl).filter((id): id is number => id !== undefined);
}

/** Drops items whose URL has no id (malformed data) and sorts by id. */
function withIds<T extends { url: string }>(items: readonly T[]): (T & { id: number })[] {
  return items
    .map((item) => ({ ...item, id: getIdFromResourceUrl(item.url) }))
    .filter((item): item is T & { id: number } => item.id !== undefined)
    .sort((a, b) => a.id - b.id);
}

function toPerson(dto: PersonDto & { id: number }): Person {
  return {
    id: dto.id,
    name: dto.name,
    heightCm: parseSwapiNumber(dto.height),
    massKg: parseSwapiNumber(dto.mass),
    birthYear: parseSwapiText(dto.birth_year),
    gender: parseSwapiText(dto.gender),
    hairColor: parseSwapiText(dto.hair_color),
    skinColor: parseSwapiText(dto.skin_color),
    eyeColor: parseSwapiText(dto.eye_color),
    homeworldId: getIdFromResourceUrl(dto.homeworld) ?? null,
    speciesIds: toIds(dto.species),
    filmIds: toIds(dto.films),
    starshipIds: toIds(dto.starships),
    vehicleIds: toIds(dto.vehicles),
  };
}

/**
 * Every character (~80) in one request. The dataset is small and static, so search,
 * filters and pagination run locally on this list.
 */
export async function getPeople(signal?: AbortSignal): Promise<Person[]> {
  const dtos = await client.get<PersonDto[]>('people', { signal });
  return withIds(dtos).map(toPerson);
}

export async function getPlanets(signal?: AbortSignal): Promise<Planet[]> {
  const dtos = await client.get<PlanetDto[]>('planets', { signal });
  return withIds(dtos).map((dto) => ({
    id: dto.id,
    name: dto.name,
    climate: parseSwapiText(dto.climate),
    terrain: parseSwapiText(dto.terrain),
    population: parseSwapiNumber(dto.population),
  }));
}

export async function getSpecies(signal?: AbortSignal): Promise<Species[]> {
  const dtos = await client.get<SpeciesDto[]>('species', { signal });
  return withIds(dtos).map((dto) => ({
    id: dto.id,
    name: dto.name,
    classification: parseSwapiText(dto.classification),
    language: parseSwapiText(dto.language),
  }));
}

/** Films in story order (episode number), not release order. */
export async function getFilms(signal?: AbortSignal): Promise<Film[]> {
  const dtos = await client.get<FilmDto[]>('films', { signal });
  return withIds(dtos)
    .map((dto) => ({
      id: dto.id,
      title: dto.title,
      episode: dto.episode_id,
      director: dto.director,
      releaseDate: dto.release_date,
    }))
    .sort((a, b) => a.episode - b.episode);
}

export async function getStarships(signal?: AbortSignal): Promise<Craft[]> {
  const dtos = await client.get<StarshipDto[]>('starships', { signal });
  return withIds(dtos).map((dto) => ({
    id: dto.id,
    name: dto.name,
    model: dto.model,
    craftClass: parseSwapiText(dto.starship_class),
  }));
}

export async function getVehicles(signal?: AbortSignal): Promise<Craft[]> {
  const dtos = await client.get<VehicleDto[]>('vehicles', { signal });
  return withIds(dtos).map((dto) => ({
    id: dto.id,
    name: dto.name,
    model: dto.model,
    craftClass: parseSwapiText(dto.vehicle_class),
  }));
}
