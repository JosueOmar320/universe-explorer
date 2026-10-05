import { createBrowserRouter } from 'react-router';
import { AppShell } from '@/app/layout/AppShell';
import { HomePage } from '@/app/pages/HomePage';
import { NotFoundPage } from '@/app/pages/NotFoundPage';
import { RouteErrorPage } from '@/app/pages/RouteErrorPage';
import { PageLoader } from '@/app/components/PageLoader';
import { universeRoutes } from '@/universes/routes';

export const router = createBrowserRouter(
  [
    {
      Component: AppShell,
      // Shown on first load while lazy universe routes are being downloaded.
      HydrateFallback: PageLoader,
      // Last-resort boundary in case the shell itself fails to render.
      ErrorBoundary: RouteErrorPage,
      children: [
        {
          // Pathless boundary: errors inside a page keep the shell (header/nav) visible.
          ErrorBoundary: RouteErrorPage,
          children: [
            { index: true, Component: HomePage },
            {
              path: 'favorites',
              lazy: async () => {
                const { FavoritesPage } = await import('@/app/pages/FavoritesPage');
                return { Component: FavoritesPage };
              },
            },
            // One lazy-loaded route tree per available universe (see src/universes/routes.ts)
            ...universeRoutes,
            { path: '*', Component: NotFoundPage },
          ],
        },
      ],
    },
  ],
  // Keeps routing working when deployed under a sub-path (e.g. GitHub Pages).
  { basename: import.meta.env.BASE_URL },
);
