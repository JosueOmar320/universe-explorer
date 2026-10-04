import { apiConfig } from '@/config/apis';
import { http, HttpResponse } from 'msw';
import { CHARACTERS_PAGE_SIZE } from '../api/rickAndMortyApi';
import type { Character } from '../api/types';
import { characters, episodes } from './fixtures';

const API_URL = apiConfig.rickAndMorty.baseUrl;

const NOT_FOUND = { error: 'There is nothing here' };

/** Mirrors the API's partial, case-insensitive matching. */
function matches(character: Character, params: URLSearchParams): boolean {
  const contains = (value: string, query: string | null) =>
    !query || value.toLowerCase().includes(query.toLowerCase());
  const equals = (value: string, query: string | null) =>
    !query || value.toLowerCase() === query.toLowerCase();

  return (
    contains(character.name, params.get('name')) &&
    contains(character.species, params.get('species')) &&
    equals(character.status, params.get('status')) &&
    equals(character.gender, params.get('gender'))
  );
}

/** Behaves like the real Rick and Morty API, backed by fixtures. */
export const rickAndMortyHandlers = [
  http.get(`${API_URL}/character`, ({ request }) => {
    const params = new URL(request.url).searchParams;
    const page = Number(params.get('page') ?? 1);
    const filtered = characters.filter((character) => matches(character, params));
    const pages = Math.ceil(filtered.length / CHARACTERS_PAGE_SIZE);
    const results = filtered.slice((page - 1) * CHARACTERS_PAGE_SIZE, page * CHARACTERS_PAGE_SIZE);

    // Like the real API: 404 instead of an empty list.
    if (results.length === 0) return HttpResponse.json(NOT_FOUND, { status: 404 });

    return HttpResponse.json({
      info: { count: filtered.length, pages, next: null, prev: null },
      results,
    });
  }),

  http.get(`${API_URL}/character/:id`, ({ params }) => {
    const character = characters.find(({ id }) => id === Number(params.id));
    return character
      ? HttpResponse.json(character)
      : HttpResponse.json({ error: 'Character not found' }, { status: 404 });
  }),

  http.get(`${API_URL}/episode/:ids`, ({ params }) => {
    const ids = String(params.ids).split(',').map(Number);
    const found = episodes.filter(({ id }) => ids.includes(id));
    // Like the real API: a single id returns a bare object.
    return HttpResponse.json(ids.length === 1 ? found[0] : found);
  }),
];
