import { normalizeSearchText } from '@/shared/utils/search';
import type { Person } from '../api/models';

/**
 * SWAPI leaves `species` empty for humans; species #1 in the API is "Human".
 * Resolving to it lets the UI show (and filter by) the API's own name.
 */
export const HUMAN_SPECIES_ID = 1;

export function getSpeciesIds(person: Person): number[] {
  return person.speciesIds.length > 0 ? person.speciesIds : [HUMAN_SPECIES_ID];
}

interface PeopleFilter {
  query?: string;
  filmId?: number;
  speciesId?: number;
}

/** Filters the cached people collection in memory. */
export function filterPeople(
  people: readonly Person[],
  { query = '', filmId, speciesId }: PeopleFilter,
): Person[] {
  const normalizedQuery = normalizeSearchText(query);

  return people.filter(
    (person) =>
      (!normalizedQuery || normalizeSearchText(person.name).includes(normalizedQuery)) &&
      (filmId === undefined || person.filmIds.includes(filmId)) &&
      (speciesId === undefined || getSpeciesIds(person).includes(speciesId)),
  );
}
