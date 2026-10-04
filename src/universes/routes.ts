import type { RouteObject } from 'react-router';
import type { AvailableUniverseId } from './registry';
import { rickAndMortyRoute } from './rick-and-morty/routes';
import type { UniverseRoute } from './types';

/**
 * Routes of every available universe. The `Record` type makes registering a route for an
 * unavailable universe — or forgetting the route of an available one — a compile error.
 */
const routesByUniverse: Record<AvailableUniverseId, UniverseRoute> = {
  'rick-and-morty': rickAndMortyRoute,
};

export const universeRoutes: RouteObject[] = Object.entries(routesByUniverse).map(
  ([id, route]) => ({ ...route, path: id }),
);
