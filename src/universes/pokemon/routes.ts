import type { UniverseRoute } from '../types';

/** Route tree for the Pokémon universe; layout and pages are lazy-loaded. */
export const pokemonRoute: UniverseRoute = {
  lazy: async () => {
    const { PokemonLayout } = await import('./layout/PokemonLayout');
    return { Component: PokemonLayout };
  },
  children: [
    {
      index: true,
      lazy: async () => {
        const { PokedexPage } = await import('./pages/PokedexPage');
        return { Component: PokedexPage };
      },
    },
    {
      path: ':pokemonId',
      lazy: async () => {
        const { PokemonDetailPage } = await import('./pages/PokemonDetailPage');
        return { Component: PokemonDetailPage };
      },
    },
  ],
};
