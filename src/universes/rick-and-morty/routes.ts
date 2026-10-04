import type { RouteObject } from 'react-router';
import type { UniverseId } from '../types';

/**
 * Route tree for the Rick and Morty universe. Layout and pages are lazy-loaded, so the
 * universe's code, styles and fonts are only downloaded when the user enters it.
 */
export const rickAndMortyRoute: RouteObject = {
  path: 'rick-and-morty' satisfies UniverseId,
  lazy: async () => {
    const { RickAndMortyLayout } = await import('./layout/RickAndMortyLayout');
    return { Component: RickAndMortyLayout };
  },
  children: [
    {
      index: true,
      lazy: async () => {
        const { CharactersPage } = await import('./pages/CharactersPage');
        return { Component: CharactersPage };
      },
    },
  ],
};
