import { fetchJson, isHttpError } from '@/shared/api/httpClient';
import type { ApiPaginatedResponse, Character, CharacterListParams, CharacterPage } from './types';

const API_BASE_URL = 'https://rickandmortyapi.com/api';

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
