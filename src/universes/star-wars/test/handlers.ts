import { http, HttpResponse } from 'msw';
import { apiConfig } from '@/config/apis';
import { filmDtos, peopleDtos, planetDtos, speciesDtos } from './fixtures';

const API = apiConfig.starWars.baseUrl;

/** Behaves like swapi.info: collection endpoints return every item at once. */
export const starWarsHandlers = [
  http.get(`${API}/people`, () => HttpResponse.json(peopleDtos)),
  http.get(`${API}/planets`, () => HttpResponse.json(planetDtos)),
  http.get(`${API}/species`, () => HttpResponse.json(speciesDtos)),
  http.get(`${API}/films`, () => HttpResponse.json(filmDtos)),
];
