import { http, HttpResponse } from 'msw';
import { apiConfig } from '@/config/apis';
import { characters } from './fixtures';

const API = apiConfig.harryPotter.baseUrl;

/** Behaves like PotterDB: JSON:API, Ransack-style filters, sorting and pagination. */
export const harryPotterHandlers = [
  http.get(`${API}/characters`, ({ request }) => {
    const params = new URL(request.url).searchParams;
    const page = Number(params.get('page[number]') ?? 1);
    const size = Math.min(Number(params.get('page[size]') ?? 50), 100);
    const nameQuery = params.get('filter[name_cont]')?.toLowerCase();
    const house = params.get('filter[house_eq]');
    const houses = params.getAll('filter[house_in][]');

    const filtered = characters
      .filter(({ attributes }) => !nameQuery || attributes.name.toLowerCase().includes(nameQuery))
      .filter(({ attributes }) => !house || attributes.house === house)
      .filter(
        ({ attributes }) =>
          houses.length === 0 || (attributes.house !== null && houses.includes(attributes.house)),
      )
      .sort((a, b) =>
        params.get('sort') === 'name' ? a.attributes.name.localeCompare(b.attributes.name) : 0,
      );
    const last = Math.max(1, Math.ceil(filtered.length / size));

    return HttpResponse.json({
      data: filtered.slice((page - 1) * size, page * size),
      meta: {
        pagination: {
          current: page,
          ...(page < last && { next: page + 1 }),
          ...(page > 1 && { prev: page - 1 }),
          last,
          records: filtered.length,
        },
      },
    });
  }),

  http.get(`${API}/characters/:slug`, ({ params }) => {
    const character = characters.find(
      ({ id, attributes }) => attributes.slug === params.slug || id === params.slug,
    );
    return character
      ? HttpResponse.json({ data: character })
      : HttpResponse.json({ errors: [{ status: '404', title: 'Not Found' }] }, { status: 404 });
  }),
];
