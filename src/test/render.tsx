import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, type RouteObject } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { TestProviders } from './TestProviders';

interface RenderRoutesOptions {
  initialEntry?: string;
}

/**
 * Renders real route components inside a memory router and a fresh QueryClient,
 * so every test starts with an empty cache and a controllable URL.
 */
export function renderRoutes(
  routes: RouteObject[],
  { initialEntry = '/' }: RenderRoutesOptions = {},
) {
  const queryClient = new QueryClient({
    defaultOptions: {
      // Retries would slow error tests down; retry policy is unit-tested separately.
      queries: { retry: false, gcTime: Infinity },
    },
  });
  const router = createMemoryRouter(routes, { initialEntries: [initialEntry] });
  const user = userEvent.setup();

  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
    { wrapper: TestProviders },
  );

  return { router, user, queryClient };
}
