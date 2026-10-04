import type { UniverseRoute } from '../types';

/** Route tree for the Star Wars universe; layout and pages are lazy-loaded. */
export const starWarsRoute: UniverseRoute = {
  lazy: async () => {
    const { StarWarsLayout } = await import('./layout/StarWarsLayout');
    return { Component: StarWarsLayout };
  },
  children: [
    {
      index: true,
      lazy: async () => {
        const { PeoplePage } = await import('./pages/PeoplePage');
        return { Component: PeoplePage };
      },
    },
  ],
};
