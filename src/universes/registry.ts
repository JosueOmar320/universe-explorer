import type { Universe, UniverseId } from './types';

/**
 * Single source of truth for the universes the shell knows about.
 * Adding a universe = add an entry here + register its routes in `src/app/router.tsx`.
 */
export const UNIVERSES: readonly Universe[] = [
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
];

export function getUniversePath(id: UniverseId): string {
  return `/${id}`;
}

/** Resolves the available universe that owns a pathname, e.g. `/rick-and-morty/...`. */
export function findUniverseByPathname(pathname: string): Universe | undefined {
  const [, firstSegment] = pathname.split('/');
  return UNIVERSES.find(
    (universe) => universe.status === 'available' && universe.id === firstSegment,
  );
}
