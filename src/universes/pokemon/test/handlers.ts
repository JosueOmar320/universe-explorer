import { http, HttpResponse } from 'msw';
import { apiConfig } from '@/config/apis';
import { pickOption } from '@/shared/utils/pickOption';
import { POKEMON_TYPES } from '../api/models';
import { pokemonDtos, speciesDtos, speciesIndex, typeDtos } from './fixtures';

const API = apiConfig.pokemon.baseUrl;
const NOT_FOUND = () => new HttpResponse('Not Found', { status: 404 });

/** Behaves like PokéAPI v2, backed by fixtures. */
export const pokemonHandlers = [
  http.get(`${API}/pokemon-species`, ({ request }) => {
    const limit = Number(new URL(request.url).searchParams.get('limit') ?? 20);
    return HttpResponse.json({
      count: speciesIndex.length,
      next: null,
      previous: null,
      results: speciesIndex.slice(0, limit),
    });
  }),

  http.get(`${API}/pokemon-species/:id`, ({ params }) => {
    const dto = speciesDtos[Number(params.id)];
    return dto ? HttpResponse.json(dto) : NOT_FOUND();
  }),

  http.get(`${API}/pokemon/:id`, ({ params }) => {
    const dto = pokemonDtos[Number(params.id)];
    return dto ? HttpResponse.json(dto) : NOT_FOUND();
  }),

  http.get(`${API}/type/:name`, ({ params }) => {
    const type = pickOption(String(params.name), POKEMON_TYPES);
    const dto = type && typeDtos[type];
    return dto ? HttpResponse.json(dto) : NOT_FOUND();
  }),
];
