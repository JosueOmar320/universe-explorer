import type { UniverseSearch } from '../types';
import { peopleQueryOptions } from './api/queries';
import { starWarsPaths } from './paths';
import { filterPeople } from './utils/people';

/** Local search over the cached people collection, like the archive itself. */
export const starWarsSearch: UniverseSearch = {
  async search(query, client, limit) {
    const matches = filterPeople(await client.ensureQueryData(peopleQueryOptions()), { query });
    return {
      total: matches.length,
      hits: matches.slice(0, limit).map((person) => ({
        id: String(person.id),
        name: person.name,
        detail: person.birthYear ?? undefined,
        href: starWarsPaths.person(person.id),
      })),
    };
  },
  listingHref: (query) => `${starWarsPaths.people}?${new URLSearchParams({ q: query })}`,
};
