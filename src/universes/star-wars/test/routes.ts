import type { RouteObject } from 'react-router';
import { PeoplePage } from '../pages/PeoplePage';

/** The universe's pages without lazy loading or the app shell. */
export const testRoutes: RouteObject[] = [{ path: '/star-wars', Component: PeoplePage }];
