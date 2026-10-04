import type { UniverseRoute } from '../types';

/** Route tree for the Harry Potter universe; layout and pages are lazy-loaded. */
export const harryPotterRoute: UniverseRoute = {
  lazy: async () => {
    const { HarryPotterLayout } = await import('./layout/HarryPotterLayout');
    return { Component: HarryPotterLayout };
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
      path: ':slug',
      lazy: async () => {
        const { CharacterDetailPage } = await import('./pages/CharacterDetailPage');
        return { Component: CharacterDetailPage };
      },
    },
  ],
};
