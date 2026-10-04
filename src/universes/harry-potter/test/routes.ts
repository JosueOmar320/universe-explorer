import type { RouteObject } from 'react-router';
import { CharactersPage } from '../pages/CharactersPage';

/** The universe's pages without lazy loading or the app shell. */
export const testRoutes: RouteObject[] = [{ path: '/harry-potter', Component: CharactersPage }];
