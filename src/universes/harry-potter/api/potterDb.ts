import { apiConfig } from '@/config/apis';
import { createApiClient } from '@/shared/api/httpClient';
import type { Character, CharacterListParams, CharacterPage } from './models';
import type { CharacterResource, JsonApiCollection, JsonApiDocument } from './types';

const client = createApiClient(apiConfig.harryPotter);

export const CHARACTERS_PAGE_SIZE = 24;

function toCharacter({ id, attributes: a }: CharacterResource): Character {
  return {
    id,
    slug: a.slug,
    name: a.name,
    house: a.house,
    species: a.species,
    gender: a.gender,
    bloodStatus: a.blood_status,
    born: a.born,
    died: a.died,
    nationality: a.nationality,
    patronus: a.patronus,
    animagus: a.animagus,
    boggart: a.boggart,
    maritalStatus: a.marital_status,
    eyeColor: a.eye_color,
    hairColor: a.hair_color,
    height: a.height,
    weight: a.weight,
    aliases: a.alias_names ?? [],
    familyMembers: a.family_members ?? [],
    jobs: a.jobs ?? [],
    romances: a.romances ?? [],
    titles: a.titles ?? [],
    wands: a.wands ?? [],
  };
}

/**
 * One page of characters, filtered and sorted by the API (JSON:API + Ransack-style
 * filters). With ~5,400 records, downloading everything like other universes isn't viable.
 */
export async function getCharacters(
  { page, name, house }: CharacterListParams,
  signal?: AbortSignal,
): Promise<CharacterPage> {
  const response = await client.get<JsonApiCollection<CharacterResource>>('characters', {
    params: {
      'page[number]': page,
      'page[size]': CHARACTERS_PAGE_SIZE,
      sort: 'name',
      'filter[name_cont]': name,
      'filter[house_eq]': house,
    },
    signal,
  });

  const { records } = response.meta.pagination;
  return {
    characters: response.data.map(toCharacter),
    totalCount: records,
    totalPages: Math.ceil(records / CHARACTERS_PAGE_SIZE),
  };
}

/** One character by slug (or id). Throws `HttpError` 404 when it doesn't exist. */
export async function getCharacter(slug: string, signal?: AbortSignal): Promise<Character> {
  const response = await client.get<JsonApiDocument<CharacterResource>>(
    `characters/${encodeURIComponent(slug)}`,
    { signal },
  );
  return toCharacter(response.data);
}
