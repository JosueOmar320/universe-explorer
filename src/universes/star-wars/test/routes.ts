import type { RouteObject } from 'react-router';
import { PeoplePage } from '../pages/PeoplePage';
import { PersonDetailPage } from '../pages/PersonDetailPage';

/** The universe's pages without lazy loading or the app shell. */
export const testRoutes: RouteObject[] = [
  { path: '/star-wars', Component: PeoplePage },
  { path: '/star-wars/people/:personId', Component: PersonDetailPage },
];
