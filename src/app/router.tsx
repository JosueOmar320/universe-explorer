import { createBrowserRouter } from 'react-router';
import { AppShell } from '@/app/layout/AppShell';
import { HomePage } from '@/app/pages/HomePage';
import { NotFoundPage } from '@/app/pages/NotFoundPage';
import { RouteErrorPage } from '@/app/pages/RouteErrorPage';

export const router = createBrowserRouter(
  [
    {
      Component: AppShell,
      // Last-resort boundary in case the shell itself fails to render.
      ErrorBoundary: RouteErrorPage,
      children: [
        {
          // Pathless boundary: errors inside a page keep the shell (header/nav) visible.
          ErrorBoundary: RouteErrorPage,
          children: [
            { index: true, Component: HomePage },
            // Universe routes are registered here.
            { path: '*', Component: NotFoundPage },
          ],
        },
      ],
    },
  ],
  // Keeps routing working when deployed under a sub-path (e.g. GitHub Pages).
  { basename: import.meta.env.BASE_URL },
);
