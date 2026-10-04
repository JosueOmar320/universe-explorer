import type { RouteObject } from 'react-router';
import { PokedexPage } from '../pages/PokedexPage';

/** The universe's pages without lazy loading or the app shell. */
export const testRoutes: RouteObject[] = [{ path: '/pokemon', Component: PokedexPage }];
