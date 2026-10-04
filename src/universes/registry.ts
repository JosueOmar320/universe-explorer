import type { Universe, UniverseId } from './types';

/**
 * Single source of truth for the universes the shell knows about. Navigation, the home
 * page and the router are all derived from this list.
 *
 * To enable a universe: set `status: 'available'` and register its routes in
 * `src/universes/routes.ts` — TypeScript reports an error until both are done.
 */
export const UNIVERSES = [
  {
    id: 'rick-and-morty',
    name: 'Rick and Morty',
    status: 'available',
    accentColor: '#97ce4c',
  },
  {
    id: 'pokemon',
    name: 'Pokémon',
    status: 'available',
    accentColor: '#ffcb05',
  },
  {
    id: 'star-wars',
    name: 'Star Wars',
    status: 'available',
    accentColor: '#ffe81f',
  },
  {
    id: 'marvel',
    name: 'Marvel',
    status: 'coming-soon',
    accentColor: '#ec1d24',
  },
] as const satisfies readonly Universe[];

/** Ids of the universes users can currently enter (derived at compile time). */
export type AvailableUniverseId = Extract<
  (typeof UNIVERSES)[number],
  { status: 'available' }
>['id'];

export function isUniverseAvailable(universe: Universe): boolean {
  return universe.status === 'available';
}

export function getUniverse(id: UniverseId): Universe {
  const universe = UNIVERSES.find((candidate) => candidate.id === id);
  if (!universe) throw new Error(`Unknown universe: ${id}`);
  return universe;
}

export function getUniversePath(id: UniverseId): string {
  return `/${id}`;
}

/** Resolves the available universe that owns a pathname, e.g. `/rick-and-morty/...`. */
export function findUniverseByPathname(pathname: string): Universe | undefined {
  const [, firstSegment] = pathname.split('/');
  return UNIVERSES.find(
    (universe) => isUniverseAvailable(universe) && universe.id === firstSegment,
  );
}
