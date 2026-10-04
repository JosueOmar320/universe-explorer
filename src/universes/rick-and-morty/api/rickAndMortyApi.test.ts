import { apiConfig } from '@/config/apis';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { HttpError } from '@/shared/api/httpClient';
import { server } from '@/test/server';
import { getCharacter, getCharacters, getEpisodes, getIdFromResourceUrl } from './rickAndMortyApi';

const API_URL = apiConfig.rickAndMorty.baseUrl;

describe('getCharacters', () => {
  it('sends the page and only the filters that are set', async () => {
    let requestedUrl: URL | undefined;
    server.use(
      http.get(`${API_URL}/character`, ({ request }) => {
        requestedUrl = new URL(request.url);
        return HttpResponse.json({
          info: { count: 0, pages: 0, next: null, prev: null },
          results: [],
        });
      }),
    );

    await getCharacters({ page: 2, name: 'rick', status: 'dead', gender: undefined });

    expect(Object.fromEntries(requestedUrl?.searchParams ?? [])).toEqual({
      page: '2',
      name: 'rick',
      status: 'dead',
    });
  });

  it('maps the API response to a UI-friendly page', async () => {
    const page = await getCharacters({ page: 1 });

    expect(page.totalCount).toBe(45);
    expect(page.totalPages).toBe(3);
    expect(page.characters).toHaveLength(20);
  });

  it('treats the API "no results" 404 as an empty page', async () => {
    await expect(getCharacters({ page: 1, name: 'nobody' })).resolves.toEqual({
      characters: [],
      totalCount: 0,
      totalPages: 0,
    });
  });

  it('rethrows other errors with their status', async () => {
    server.use(http.get(`${API_URL}/character`, () => new HttpResponse(null, { status: 500 })));

    await expect(getCharacters({ page: 1 })).rejects.toMatchObject({ status: 500 });
  });
});

describe('getCharacter', () => {
  it('throws a 404 HttpError for unknown ids', async () => {
    const error = await getCharacter(9999).catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(HttpError);
    expect(error).toMatchObject({ status: 404 });
  });
});

describe('getEpisodes', () => {
  it('always returns an array, even when the API returns a single object', async () => {
    const result = await getEpisodes([1]);

    expect(result).toEqual([expect.objectContaining({ id: 1, name: 'Pilot' })]);
  });

  it('fetches several episodes in one request', async () => {
    const result = await getEpisodes([1, 2, 12]);
    expect(result.map((episode) => episode.id)).toEqual([1, 2, 12]);
  });

  it('skips the request when there are no ids', async () => {
    // Any request would fail the test (unhandled requests are errors).
    server.use(http.get(`${API_URL}/episode/:ids`, () => HttpResponse.error()));
    await expect(getEpisodes([])).resolves.toEqual([]);
  });
});

describe('getIdFromResourceUrl', () => {
  it('extracts the trailing numeric id', () => {
    expect(getIdFromResourceUrl(`${API_URL}/episode/28`)).toBe(28);
  });

  it('returns undefined when there is no valid id', () => {
    expect(getIdFromResourceUrl('')).toBeUndefined();
    expect(getIdFromResourceUrl(`${API_URL}/episode/abc`)).toBeUndefined();
  });
});
