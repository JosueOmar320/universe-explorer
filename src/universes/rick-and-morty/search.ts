import type { UniverseSearch } from '../types';
import { charactersQueryOptions } from './api/queries';
import { rickAndMortyPaths } from './paths';

/** Server-side search: the same query (and cache entry) as the listing filtered by name. */
export const rickAndMortySearch: UniverseSearch = {
  async search(query, client, limit) {
    const page = await client.fetchQuery(charactersQueryOptions({ page: 1, name: query }));
    return {
      total: page.totalCount,
      hits: page.characters.slice(0, limit).map((character) => ({
        id: String(character.id),
        name: character.name,
        detail: character.species,
        href: rickAndMortyPaths.character(character.id),
      })),
    };
  },
  listingHref: (query) => `${rickAndMortyPaths.characters}?${new URLSearchParams({ name: query })}`,
};
