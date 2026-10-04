import { screen, within } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { apiConfig } from '@/config/apis';
import { i18n } from '@/i18n/i18n';
import { renderRoutes } from '@/test/render';
import { server } from '@/test/server';
import { testRoutes } from '../test/routes';

const API = apiConfig.starWars.baseUrl;

const renderPage = (initialEntry = '/star-wars') => renderRoutes(testRoutes, { initialEntry });

const cardFor = (name: string) =>
  screen.getByRole('heading', { level: 3, name }).closest('article') as HTMLElement;

describe('PeoplePage', () => {
  it('shows a loading state, then the first page of the archive', async () => {
    renderPage();

    expect(screen.getByRole('status')).toHaveTextContent('Loading records');
    expect(await screen.findByRole('heading', { level: 3, name: 'Luke Skywalker' })).toBeVisible();
    expect(screen.getAllByRole('article')).toHaveLength(12);
    expect(screen.getByText('Showing 1–12 of 14')).toBeVisible();
  });

  it('shows the hero counts from the API', async () => {
    renderPage();
    await screen.findByRole('heading', { level: 3, name: 'Luke Skywalker' });

    expect(screen.getByText('Records').nextElementSibling).toHaveTextContent('14');
    expect(await screen.findByText('Worlds')).toBeVisible();
    expect(screen.getByText('Films').nextElementSibling).toHaveTextContent('2');
  });

  it('resolves species and homeworld names, treating an empty species as Human', async () => {
    renderPage();
    await screen.findByRole('heading', { level: 3, name: 'Luke Skywalker' });

    expect(await within(cardFor('Luke Skywalker')).findByText('Human · Tatooine')).toBeVisible();
    expect(
      await within(cardFor('Jabba Desilijic Tiure')).findByText('Hutt · Nal Hutta'),
    ).toBeVisible();
  });

  it('shows metrics with units, and "Unknown" for missing values', async () => {
    renderPage();
    await screen.findByRole('heading', { level: 3, name: 'Luke Skywalker' });

    const jabba = cardFor('Jabba Desilijic Tiure');
    expect(within(jabba).getByText('Mass').nextElementSibling).toHaveTextContent('1,358 kg');
    const vader = cardFor('Darth Vader');
    expect(within(vader).getByText('Mass').nextElementSibling).toHaveTextContent('Unknown');
  });

  it('marks the films each person appears in', async () => {
    renderPage();
    await screen.findByRole('heading', { level: 3, name: 'Luke Skywalker' });

    expect(
      await within(cardFor('Luke Skywalker')).findByRole('img', {
        name: 'Appears in 2 of 2 films',
      }),
    ).toBeVisible();
    expect(
      within(cardFor('Darth Vader')).getByRole('img', { name: 'Appears in 1 of 2 films' }),
    ).toBeVisible();
  });

  it('paginates locally', async () => {
    const { user, router } = renderPage();
    await screen.findByRole('heading', { level: 3, name: 'Luke Skywalker' });

    await user.click(screen.getByRole('button', { name: 'Next page' }));

    expect(await screen.findByText('Showing 13–14 of 14')).toBeVisible();
    expect(router.state.location.search).toBe('?page=2');
  });

  it('renders its own copy in Spanish', async () => {
    await i18n.changeLanguage('es');
    renderPage();

    expect(await screen.findByText('Mostrando 1–12 de 14')).toBeVisible();
    expect(screen.getByRole('heading', { level: 2, name: 'Personal' })).toBeVisible();
    expect(within(cardFor('Darth Vader')).getByText('Masa').nextElementSibling).toHaveTextContent(
      'Desconocido',
    );
  });

  it('shows an error state with retry when the archive is unreachable', async () => {
    server.use(
      http.get(`${API}/people`, () => new HttpResponse(null, { status: 503 }), { once: true }),
    );
    const { user } = renderPage();

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('The archive is unreachable');
    await user.click(within(alert).getByRole('button', { name: 'Try again' }));

    expect(await screen.findByRole('heading', { level: 3, name: 'Luke Skywalker' })).toBeVisible();
  });

  describe('search and filters', () => {
    const cardNames = () =>
      screen.getAllByRole('article').map((card) => within(card).getByRole('heading').textContent);

    it('searches by name locally and keeps the search in the URL', async () => {
      const { user, router } = renderPage();
      await screen.findByRole('heading', { level: 3, name: 'Luke Skywalker' });

      await user.type(screen.getByRole('searchbox', { name: 'Search by name' }), 'c3po');

      expect(await screen.findByText('Showing 1–1 of 1 match')).toBeVisible();
      expect(cardNames()).toEqual(['C-3PO']);
      expect(router.state.location.search).toBe('?q=c3po');
    });

    it('filters by film, announcing each option by its full title', async () => {
      const { user, router } = renderPage('/star-wars?page=2');
      await screen.findByText('Showing 13–14 of 14');

      await user.click(
        await screen.findByRole('radio', { name: 'Episode V: The Empire Strikes Back' }),
      );

      expect(await screen.findByText('Showing 1–1 of 1 match')).toBeVisible();
      expect(cardNames()).toEqual(['Luke Skywalker']);
      expect(router.state.location.search).toBe('?episode=5');
    });

    it('filters by species with the API names, counting implicit humans as Human', async () => {
      const { user } = renderPage();
      await screen.findByRole('heading', { level: 3, name: 'Luke Skywalker' });

      const species = screen.getByRole('combobox', { name: 'Species' });
      await user.selectOptions(species, 'Droid');
      expect(await screen.findByText('Showing 1–1 of 1 match')).toBeVisible();
      expect(cardNames()).toEqual(['C-3PO']);

      await user.selectOptions(species, 'Human');
      expect(await screen.findByText('Showing 1–12 of 12 matches')).toBeVisible();
      expect(cardNames()).toContain('Luke Skywalker');
      expect(cardNames()).not.toContain('C-3PO');
    });

    it('ignores ids from the URL that do not exist in the archive', async () => {
      renderPage('/star-wars?episode=42');

      // The unknown episode doesn't empty the list: every record is still listed.
      expect(await screen.findByText(/^Showing 1–12 of 14/)).toBeVisible();
      expect(screen.getAllByRole('article')).toHaveLength(12);
    });

    it('shows an empty state that clears every filter', async () => {
      const { user, router } = renderPage('/star-wars?q=yoda&species=2');

      expect(await screen.findByRole('heading', { name: 'No records match' })).toBeVisible();
      await user.click(screen.getByRole('button', { name: 'Clear filters' }));

      expect(await screen.findByText('Showing 1–12 of 14')).toBeVisible();
      expect(router.state.location.search).toBe('');
    });
  });
});
