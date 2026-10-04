import type { RouteObject } from 'react-router';
import { CharacterDetailPage } from '../pages/CharacterDetailPage';
import { CharactersPage } from '../pages/CharactersPage';

/** The universe's pages without lazy loading or the app shell. */
export const testRoutes: RouteObject[] = [
  { path: '/rick-and-morty', Component: CharactersPage },
  { path: '/rick-and-morty/characters/:characterId', Component: CharacterDetailPage },
];
