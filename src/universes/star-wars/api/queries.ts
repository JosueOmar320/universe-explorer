import { queryOptions } from '@tanstack/react-query';
import { getFilms, getPeople, getPlanets, getSpecies } from './swapi';

/** SWAPI's data is frozen: once loaded, collections never go stale during a session. */
const STATIC_DATA = { staleTime: Infinity, gcTime: 60 * 60 * 1000 } as const;

export const starWarsKeys = {
  all: ['star-wars'] as const,
  people: () => [...starWarsKeys.all, 'people'] as const,
  planets: () => [...starWarsKeys.all, 'planets'] as const,
  species: () => [...starWarsKeys.all, 'species'] as const,
  films: () => [...starWarsKeys.all, 'films'] as const,
};

export function peopleQueryOptions() {
  return queryOptions({
    queryKey: starWarsKeys.people(),
    queryFn: ({ signal }) => getPeople(signal),
    ...STATIC_DATA,
  });
}

export function planetsQueryOptions() {
  return queryOptions({
    queryKey: starWarsKeys.planets(),
    queryFn: ({ signal }) => getPlanets(signal),
    ...STATIC_DATA,
  });
}

export function speciesQueryOptions() {
  return queryOptions({
    queryKey: starWarsKeys.species(),
    queryFn: ({ signal }) => getSpecies(signal),
    ...STATIC_DATA,
  });
}

export function filmsQueryOptions() {
  return queryOptions({
    queryKey: starWarsKeys.films(),
    queryFn: ({ signal }) => getFilms(signal),
    ...STATIC_DATA,
  });
}
