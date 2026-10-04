import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HomePage } from '@/app/pages/HomePage';
import { renderRoutes } from '@/test/render';
import { AppShell } from './AppShell';

function UniversePlaceholder() {
  return <h1>Rick and Morty universe</h1>;
}

const renderShell = () =>
  renderRoutes([
    {
      Component: AppShell,
      children: [
        { index: true, Component: HomePage },
        { path: 'rick-and-morty', Component: UniversePlaceholder },
      ],
    },
  ]);

describe('AppShell', () => {
  it('offers a skip link to the main content', () => {
    renderShell();

    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute(
      'href',
      '#main-content',
    );
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content');
  });

  it('links to every available universe from the navigation', () => {
    renderShell();
    const nav = screen.getByRole('navigation', { name: 'Universes' });

    for (const name of ['Rick and Morty', 'Pokémon', 'Star Wars', 'Harry Potter']) {
      expect(within(nav).getByRole('link', { name })).toBeVisible();
    }
    expect(within(nav).queryByText('(coming soon)')).not.toBeInTheDocument();
  });

  it('moves focus to the main content after navigating, so it is not lost', async () => {
    const { user } = renderShell();

    // The home card link: its accessible name is just the universe name.
    const cardLink = screen.getByRole('heading', { level: 3, name: 'Rick and Morty' })
      .firstElementChild as HTMLElement;
    await user.click(cardLink);

    expect(await screen.findByRole('heading', { name: 'Rick and Morty universe' })).toBeVisible();
    expect(screen.getByRole('main')).toHaveFocus();
  });
});
