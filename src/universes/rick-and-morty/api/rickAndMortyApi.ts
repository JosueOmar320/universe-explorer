import { fetchJson, isHttpError } from '@/shared/api/httpClient';
import type {
  ApiPaginatedResponse,
  Character,
  CharacterListParams,
  CharacterPage,
  Episode,
} from './types';

export const API_BASE_URL = 'https://rickandmortyapi.com/api';

/** Fixed by the API; used to compute "Showing 21–40" ranges. */
export const CHARACTERS_PAGE_SIZE = 20;

const EMPTY_PAGE: CharacterPage = { characters: [], totalCount: 0, totalPages: 0 };

export async function getCharacters(
  { page, ...filters }: CharacterListParams,
  signal?: AbortSignal,
): Promise<CharacterPage> {
  const url = new URL(`${API_BASE_URL}/character`);
  url.searchParams.set('page', String(page));
  for (const [key, value] of Object.entries(filters)) {
    if (value) url.searchParams.set(key, value);
  }

  try {
    const response = await fetchJson<ApiPaginatedResponse<Character>>(url, { signal });
    return {
      characters: response.results,
      totalCount: response.info.count,
      totalPages: response.info.pages,
    };
  } catch (error) {
    // The API answers 404 (instead of an empty list) when a page or filter has no results.
    if (isHttpError(error, 404)) return EMPTY_PAGE;
    throw error;
  }
}

/** Throws `HttpError` 404 when the character doesn't exist. */
export function getCharacter(id: number, signal?: AbortSignal): Promise<Character> {
  return fetchJson<Character>(`${API_BASE_URL}/character/${id}`, { signal });
}

/** Fetches several episodes in a single request (`/episode/1,2,3`). */
export async function getEpisodes(
  ids: readonly number[],
  signal?: AbortSignal,
): Promise<Episode[]> {
  if (ids.length === 0) return [];

  // The API returns a bare object (not an array) when asked for a single id.
  const response = await fetchJson<Episode | Episode[]>(
    `${API_BASE_URL}/episode/${ids.join(',')}`,
    {
      signal,
    },
  );
  return Array.isArray(response) ? response : [response];
}

/** Extracts the numeric id from a resource URL such as `.../api/episode/28`. */
export function getIdFromResourceUrl(url: string): number | undefined {
  const id = Number(url.split('/').at(-1));
  return Number.isInteger(id) && id > 0 ? id : undefined;
}
