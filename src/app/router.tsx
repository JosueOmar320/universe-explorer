import { createBrowserRouter } from 'react-router';
import { AppShell } from '@/app/layout/AppShell';
import { HomePage } from '@/app/pages/HomePage';
import { NotFoundPage } from '@/app/pages/NotFoundPage';
import { RouteErrorPage } from '@/app/pages/RouteErrorPage';
import { PageLoader } from '@/app/components/PageLoader';
import { rickAndMortyRoute } from '@/universes/rick-and-morty/routes';

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
            // Universe routes (lazy-loaded)
            rickAndMortyRoute,
            { path: '*', Component: NotFoundPage },
          ],
        },
      ],
    },
  ],
  // Keeps routing working when deployed under a sub-path (e.g. GitHub Pages).
  { basename: import.meta.env.BASE_URL },
);
