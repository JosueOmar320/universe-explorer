import { screen, within } from '@testing-library/react';
import { useLocation } from 'react-router';
import { describe, expect, it } from 'vitest';
import { AppShell } from '@/app/layout/AppShell';
import type { Favorite } from '@/shared/favorites/favorites';
import { renderRoutes } from '@/test/render';
import { FavoritesPage } from './FavoritesPage';

function CurrentLocation() {
  return <h1>{useLocation().pathname}</h1>;
}

const saved = (favorites: Favorite[]) =>
  localStorage.setItem('universe-explorer:favorites', JSON.stringify(favorites));

const luke: Favorite = {
  universe: 'star-wars',
  id: '1',
  name: 'Luke Skywalker',
  detail: '19BBY',
  href: '/star-wars/people/1',
  savedAt: 1,
};
const vader: Favorite = {
  ...luke,
  id: '4',
  name: 'Darth Vader',
  href: '/star-wars/people/4',
  savedAt: 3,
};
const pikachu: Favorite = {
  universe: 'pokemon',
  id: '25',
  name: 'Pikachu',
  detail: '#0025',
  href: '/pokemon/25',
  savedAt: 2,
};

const renderFavorites = () =>
  renderRoutes(
    [
      {
        Component: AppShell,
        children: [
          { path: 'favorites', Component: FavoritesPage },
          { path: '*', Component: CurrentLocation },
        ],
      },
    ],
    { initialEntry: '/favorites' },
  );

describe('FavoritesPage', () => {
  it('explains how to add favorites when there are none', () => {
    renderFavorites();

    expect(screen.getByRole('heading', { level: 2, name: 'No favorites yet' })).toBeVisible();
    expect(screen.getByRole('link', { name: 'Explore the universes' })).toHaveAttribute(
      'href',
      '/',
    );
    expect(screen.getByRole('link', { name: 'Favorites' })).toBeVisible();
  });

  it('groups favorites by universe in registry order, newest first, linking to each record', async () => {
    saved([luke, pikachu, vader]);
    const { user } = renderFavorites();

    expect(screen.getByText('3 saved')).toBeVisible();
    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual([
      'Pokémon',
      'Star Wars',
    ]);
    const starWars = screen.getByRole('region', { name: 'Star Wars' });
    expect(
      within(starWars)
        .getAllByRole('link')
        .map((link) => link.textContent),
    ).toEqual(['Darth Vader', 'Luke Skywalker']);
    expect(screen.getByRole('link', { name: 'Favorites, 3 saved' })).toHaveAttribute(
      'aria-current',
      'page',
    );

    await user.click(within(starWars).getByRole('link', { name: 'Luke Skywalker' }));

    expect(
      await screen.findByRole('heading', { level: 1, name: '/star-wars/people/1' }),
    ).toBeVisible();
  });

  it('removes one favorite, keeps the focus in the list and announces it', async () => {
    saved([luke, pikachu, vader]);
    const { user } = renderFavorites();

    await user.click(screen.getByRole('button', { name: 'Remove Darth Vader from favorites' }));

    expect(screen.queryByRole('link', { name: 'Darth Vader' })).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Remove Luke Skywalker from favorites' }),
    ).toHaveFocus();
    expect(screen.getByRole('status')).toHaveTextContent('Darth Vader removed from favorites.');
    expect(screen.getByRole('link', { name: 'Favorites, 2 saved' })).toBeVisible();
  });

  it('moves focus to the heading once the last favorite is removed', async () => {
    saved([pikachu]);
    const { user } = renderFavorites();

    await user.click(screen.getByRole('button', { name: 'Remove Pikachu from favorites' }));

    expect(screen.getByRole('heading', { level: 1, name: 'Favorites' })).toHaveFocus();
    expect(screen.getByRole('heading', { level: 2, name: 'No favorites yet' })).toBeVisible();
  });

  it('asks before clearing everything, and can be cancelled', async () => {
    saved([luke, pikachu]);
    const { user } = renderFavorites();

    await user.click(screen.getByRole('button', { name: 'Clear all' }));
    const question = screen.getByRole('group', { name: 'Remove all 2 favorites?' });
    expect(within(question).getByRole('button', { name: 'Cancel' })).toHaveFocus();

    await user.click(within(question).getByRole('button', { name: 'Cancel' }));
    expect(screen.getByRole('button', { name: 'Clear all' })).toHaveFocus();
    expect(screen.getByText('2 saved')).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Clear all' }));
    await user.click(screen.getByRole('button', { name: 'Remove all' }));

    expect(screen.getByRole('heading', { level: 2, name: 'No favorites yet' })).toBeVisible();
    expect(screen.getByRole('heading', { level: 1, name: 'Favorites' })).toHaveFocus();
    expect(screen.getByRole('status')).toHaveTextContent('All favorites removed.');
    expect(localStorage.getItem('universe-explorer:favorites')).toBe('[]');
  });
});
