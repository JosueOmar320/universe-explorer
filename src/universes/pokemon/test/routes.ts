import type { RouteObject } from 'react-router';
import { PokedexPage } from '../pages/PokedexPage';
import { PokemonDetailPage } from '../pages/PokemonDetailPage';

/** The universe's pages without lazy loading or the app shell. */
export const testRoutes: RouteObject[] = [
  { path: '/pokemon', Component: PokedexPage },
  { path: '/pokemon/:pokemonId', Component: PokemonDetailPage },
];
