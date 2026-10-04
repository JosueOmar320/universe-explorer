import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AppShell } from '@/app/layout/AppShell';
import { renderRoutes } from '@/test/render';
import { RouteErrorPage } from './RouteErrorPage';

function BrokenPage(): never {
  throw new Error('Cannot read properties of undefined');
}

/** Same structure as the app router: a pathless boundary inside the shell. */
const renderApp = (initialEntry: string) =>
  renderRoutes(
    [
      {
        Component: AppShell,
        children: [
          {
            ErrorBoundary: RouteErrorPage,
            children: [
              { index: true, Component: () => <h1>Home</h1> },
              { path: 'broken', Component: BrokenPage },
              {
                // What a deploy that replaced the chunk looks like to a stale tab.
                path: 'stale-chunk',
                lazy: () =>
                  Promise.reject(new TypeError('Failed to fetch dynamically imported module')),
              },
            ],
          },
        ],
      },
    ],
    { initialEntry },
  );

describe('RouteErrorPage', () => {
  it('replaces a page that crashed, keeping the shell, and leads back home', async () => {
    // React reports the caught error on the console; the test asserts on the page instead.
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const { user } = renderApp('/broken');

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Something went wrong' }),
    ).toBeVisible();
    expect(screen.getByRole('navigation', { name: 'Universes' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Reload page' })).toBeVisible();
    // Development builds also show the technical detail.
    expect(screen.getByText('Cannot read properties of undefined')).toBeVisible();

    await user.click(screen.getByRole('link', { name: 'Back to universes' }));

    expect(await screen.findByRole('heading', { level: 1, name: 'Home' })).toBeVisible();
  });

  it('also catches a lazy page that fails to load', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    renderApp('/stale-chunk');

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Something went wrong' }),
    ).toBeVisible();
    expect(screen.getByText('Failed to fetch dynamically imported module')).toBeVisible();
  });
});
