import type { UniverseRoute } from '../types';

/**
 * Route tree for the Rick and Morty universe. Layout and pages are lazy-loaded, so the
 * universe's code, styles and fonts are only downloaded when the user enters it.
 */
export const rickAndMortyRoute: UniverseRoute = {
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
    {
      path: 'characters/:characterId',
      lazy: async () => {
        const { CharacterDetailPage } = await import('./pages/CharacterDetailPage');
        return { Component: CharacterDetailPage };
      },
    },
  ],
};
