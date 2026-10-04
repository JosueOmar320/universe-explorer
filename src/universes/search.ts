import { harryPotterSearch } from './harry-potter/search';
import { pokemonSearch } from './pokemon/search';
import { type AvailableUniverseId, isUniverseAvailable, UNIVERSES } from './registry';
import { rickAndMortySearch } from './rick-and-morty/search';
import { starWarsSearch } from './star-wars/search';
import type { Universe, UniverseSearch } from './types';

/**
 * How each available universe takes part in the global search. As with routes, the `Record`
 * type makes forgetting one (or adding an unavailable one) a compile error. Only the search
 * palette imports this module, so none of it reaches the main bundle.
 */
const searchByUniverse: Record<AvailableUniverseId, UniverseSearch> = {
  'rick-and-morty': rickAndMortySearch,
  pokemon: pokemonSearch,
  'star-wars': starWarsSearch,
  'harry-potter': harryPotterSearch,
};

type AvailableUniverse = Extract<(typeof UNIVERSES)[number], { id: AvailableUniverseId }>;

/** Searchable universes in registry order, with the metadata the palette shows. */
export const searchableUniverses: (Universe & UniverseSearch)[] = UNIVERSES.filter(
  (universe): universe is AvailableUniverse => isUniverseAvailable(universe),
).map((universe) => ({ ...universe, ...searchByUniverse[universe.id] }));
