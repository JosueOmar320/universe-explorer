import type { UniverseSearch } from '../types';
import { charactersQueryOptions } from './api/queries';
import { harryPotterPaths } from './paths';

/**
 * Server-side search across every record (not only Hogwarts students): the same query and
 * cache entry as the registry's "Everyone" scope filtered by name.
 */
export const harryPotterSearch: UniverseSearch = {
  async search(query, client, limit) {
    const page = await client.fetchQuery(charactersQueryOptions({ page: 1, name: query }));
    return {
      total: page.totalCount,
      hits: page.characters.slice(0, limit).map((character) => ({
        id: character.id,
        name: character.name,
        detail: character.house ?? character.species ?? undefined,
        href: harryPotterPaths.character(character.slug),
      })),
    };
  },
  listingHref: (query) =>
    `${harryPotterPaths.characters}?${new URLSearchParams({ q: query, house: 'everyone' })}`,
};
