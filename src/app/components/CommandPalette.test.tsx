import { screen, within } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { useLocation } from 'react-router';
import { describe, expect, it } from 'vitest';
import { AppShell } from '@/app/layout/AppShell';
import { apiConfig } from '@/config/apis';
import { renderRoutes } from '@/test/render';
import { server } from '@/test/server';

function Home() {
  return <h1>Home</h1>;
}

/** Stands in for every other page: shows where the search navigated to. */
function CurrentLocation() {
  const { pathname, search } = useLocation();
  return <h1>{`${pathname}${search}`}</h1>;
}

const renderApp = () =>
  renderRoutes([
    {
      Component: AppShell,
      children: [
        { index: true, Component: Home },
        { path: '*', Component: CurrentLocation },
      ],
    },
  ]);

async function openSearch(user: ReturnType<typeof renderApp>['user']) {
  await user.click(screen.getByRole('button', { name: 'Search' }));
  return screen.findByRole('combobox', { name: 'Search characters in every universe' });
}

describe('CommandPalette', () => {
  it('opens with Ctrl+K, focused on the search box', async () => {
    const { user } = renderApp();

    await user.keyboard('{Control>}k{/Control}');

    expect(await screen.findByRole('dialog', { name: 'Search every universe' })).toBeVisible();
    expect(screen.getByRole('combobox')).toHaveFocus();
    expect(screen.getByText(/Type at least 2 characters/)).toBeVisible();
  });

  it('shows the matches of every universe, grouped by universe', async () => {
    const { user } = renderApp();
    await user.type(await openSearch(user), 'lu');

    const starWars = await screen.findByRole('group', { name: 'Star Wars' });
    const harryPotter = await screen.findByRole('group', { name: 'Harry Potter' });

    expect(within(starWars).getByRole('option', { name: /Luke Skywalker/ })).toBeVisible();
    expect(
      within(harryPotter)
        .getAllByRole('option')
        .map((option) => option.textContent),
    ).toEqual(['Draco Lucius MalfoySlytherin', 'Luna LovegoodRavenclaw']);
    // No matches there: no group.
    expect(screen.queryByRole('group', { name: 'Rick and Morty' })).not.toBeInTheDocument();
    expect(screen.queryByRole('group', { name: 'Pokémon' })).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('3 results');
  });

  it('moves through the results with the arrow keys and opens one with Enter', async () => {
    const { user } = renderApp();
    const combobox = await openSearch(user);
    await user.type(combobox, 'lu');
    const luke = await screen.findByRole('option', { name: /Luke Skywalker/ });

    expect(luke).toHaveAttribute('aria-selected', 'true');
    expect(combobox).toHaveAttribute('aria-activedescendant', luke.id);

    await user.keyboard('{ArrowDown}');
    const draco = screen.getByRole('option', { name: /Draco Lucius Malfoy/ });
    expect(combobox).toHaveAttribute('aria-activedescendant', draco.id);
    expect(draco).toHaveAttribute('aria-selected', 'true');

    await user.keyboard('{Enter}');

    expect(
      await screen.findByRole('heading', { name: '/harry-potter/draco-malfoy' }),
    ).toBeVisible();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('finds Pokémon by number', async () => {
    const { user } = renderApp();
    await user.type(await openSearch(user), '25');

    const pokemon = await screen.findByRole('group', { name: 'Pokémon' });

    expect(within(pokemon).getByRole('option', { name: /Pikachu/ })).toHaveTextContent('#0025');
  });

  it('links to the full listing when a universe has more matches than it shows', async () => {
    const { user } = renderApp();
    await user.type(await openSearch(user), 'hogwarts');

    await user.click(await screen.findByRole('option', { name: 'See all 24 in Harry Potter' }));

    expect(
      await screen.findByRole('heading', { name: '/harry-potter?q=hogwarts&house=everyone' }),
    ).toBeVisible();
  });

  it('says so when nothing matches', async () => {
    const { user } = renderApp();
    await user.type(await openSearch(user), 'zzz');

    expect(await screen.findByText('Nothing matches “zzz” in any universe.')).toBeVisible();
    expect(screen.queryAllByRole('option')).toHaveLength(0);
  });

  it('keeps the results of the other universes when one fails', async () => {
    server.use(
      http.get(`${apiConfig.harryPotter.baseUrl}/characters`, () =>
        HttpResponse.json({ errors: [] }, { status: 500 }),
      ),
    );
    const { user } = renderApp();
    await user.type(await openSearch(user), 'lu');

    expect(await screen.findByText("Couldn't search Harry Potter.")).toBeVisible();
    expect(screen.getByRole('option', { name: /Luke Skywalker/ })).toBeVisible();
  });

  it('gives focus back when dismissed without opening a result', async () => {
    const { user } = renderApp();
    await openSearch(user);

    await user.click(screen.getByRole('button', { name: 'Close search' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toHaveFocus();
  });
});
