import type { RouteObject } from 'react-router';
import { harryPotterRoute } from './harry-potter/routes';
import type { AvailableUniverseId } from './registry';
import { pokemonRoute } from './pokemon/routes';
import { rickAndMortyRoute } from './rick-and-morty/routes';
import { starWarsRoute } from './star-wars/routes';
import type { UniverseRoute } from './types';

/**
 * Routes of every available universe. The `Record` type makes registering a route for an
 * unavailable universe — or forgetting the route of an available one — a compile error.
 */
const routesByUniverse: Record<AvailableUniverseId, UniverseRoute> = {
  'rick-and-morty': rickAndMortyRoute,
  pokemon: pokemonRoute,
  'star-wars': starWarsRoute,
  'harry-potter': harryPotterRoute,
};

export const universeRoutes: RouteObject[] = Object.entries(routesByUniverse).map(
  ([id, route]) => ({ ...route, path: id }),
);
