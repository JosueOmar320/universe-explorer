import type { UniverseSearch } from '../types';
import { pokedexIndexQueryOptions } from './api/queries';
import { pokemonPaths } from './paths';
import { formatDexNumber, formatPokemonName } from './utils/format';
import { filterPokedex } from './utils/search';

/** Local search over the cached Pokédex index, by name or number, like the Pokédex itself. */
export const pokemonSearch: UniverseSearch = {
  async search(query, client, limit) {
    const matches = filterPokedex(await client.ensureQueryData(pokedexIndexQueryOptions()), {
      query,
    });
    return {
      total: matches.length,
      hits: matches.slice(0, limit).map((entry) => ({
        id: String(entry.id),
        name: formatPokemonName(entry.name),
        detail: formatDexNumber(entry.id),
        href: pokemonPaths.pokemon(entry.id),
      })),
    };
  },
  listingHref: (query) => `${pokemonPaths.pokedex}?${new URLSearchParams({ q: query })}`,
};
