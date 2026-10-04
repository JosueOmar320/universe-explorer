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
    tagline: 'Browse every character across infinite dimensions.',
    status: 'available',
    accentColor: '#97ce4c',
  },
  {
    id: 'pokemon',
    name: 'Pokémon',
    tagline: 'Catch, compare and inspect creatures and their stats.',
    status: 'coming-soon',
    accentColor: '#ffcb05',
  },
  {
    id: 'star-wars',
    name: 'Star Wars',
    tagline: 'Explore people, planets and starships of the galaxy.',
    status: 'coming-soon',
    accentColor: '#ffe81f',
  },
  {
    id: 'marvel',
    name: 'Marvel',
    tagline: 'Search heroes, villains and the comics they appear in.',
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
