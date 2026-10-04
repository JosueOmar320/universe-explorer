import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { apiConfig } from '@/config/apis';
import { HttpError } from '@/shared/api/httpClient';
import { server } from '@/test/server';
import { getCharacter, getCharacters } from './potterDb';

const API = apiConfig.harryPotter.baseUrl;

describe('getCharacters', () => {
  it('sends JSON:API pagination, sorting and Ransack filters', async () => {
    let params: Record<string, string> = {};
    server.use(
      http.get(`${API}/characters`, ({ request }) => {
        params = Object.fromEntries(new URL(request.url).searchParams);
        return HttpResponse.json({ data: [], meta: { pagination: { current: 2, records: 0 } } });
      }),
    );

    await getCharacters({ page: 2, name: 'potter', house: 'Gryffindor' });

    expect(params).toEqual({
      'page[number]': '2',
      'page[size]': '24',
      sort: 'name',
      'filter[name_cont]': 'potter',
      'filter[house_eq]': 'Gryffindor',
    });
  });

  it('restricts to several houses with a repeated `house_in[]` filter', async () => {
    let houses: string[] = [];
    server.use(
      http.get(`${API}/characters`, ({ request }) => {
        houses = new URL(request.url).searchParams.getAll('filter[house_in][]');
        return HttpResponse.json({ data: [], meta: { pagination: { current: 1, records: 0 } } });
      }),
    );

    await getCharacters({ page: 1, houses: ['Gryffindor', 'Slytherin'] });

    expect(houses).toEqual(['Gryffindor', 'Slytherin']);
  });

  it('flattens resources into models and computes the page count', async () => {
    const page = await getCharacters({ page: 1 });

    expect(page.totalCount).toBe(30);
    expect(page.totalPages).toBe(2);
    expect(page.characters).toHaveLength(24);
    expect(page.characters.find(({ slug }) => slug === 'harry-potter')).toMatchObject({
      id: 'uuid-harry-potter',
      name: 'Harry James Potter',
      house: 'Gryffindor',
      bloodStatus: 'Half-blood',
      aliases: ['The Boy Who Lived', 'The Chosen One'],
    });
  });

  it('returns an empty page when nothing matches', async () => {
    await expect(getCharacters({ page: 1, name: 'voldemort' })).resolves.toEqual({
      characters: [],
      totalCount: 0,
      totalPages: 0,
    });
  });
});

describe('getCharacter', () => {
  it('loads a character by slug', async () => {
    await expect(getCharacter('luna-lovegood')).resolves.toMatchObject({
      name: 'Luna Lovegood',
      house: 'Ravenclaw',
    });
  });

  it('throws a 404 HttpError for unknown slugs', async () => {
    const error = await getCharacter('no-such-wizard').catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(HttpError);
    expect(error).toMatchObject({ status: 404 });
  });
});
