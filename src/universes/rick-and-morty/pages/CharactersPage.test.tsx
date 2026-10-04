import { apiConfig } from '@/config/apis';
import { screen, within } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { renderRoutes } from '@/test/render';
import { server } from '@/test/server';
import { testRoutes } from '../test/routes';

const API_URL = apiConfig.rickAndMorty.baseUrl;

const renderPage = (initialEntry = '/rick-and-morty') => renderRoutes(testRoutes, { initialEntry });

const characterNames = () =>
  screen.getAllByRole('article').map((card) => within(card).getByRole('heading').textContent);

describe('CharactersPage', () => {
  it('shows a loading state, then the first page of characters', async () => {
    renderPage();

    expect(screen.getByRole('status')).toHaveTextContent('Loading characters');
    expect(await screen.findByRole('link', { name: 'Rick Sanchez' })).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(20);
    expect(screen.getByText('Showing 1–20 of 45')).toBeInTheDocument();
  });

  it('paginates through the URL', async () => {
    const { user, router } = renderPage();
    await screen.findByRole('link', { name: 'Rick Sanchez' });

    await user.click(screen.getByRole('button', { name: 'Next page' }));

    expect(await screen.findByText('Showing 21–40 of 45')).toBeInTheDocument();
    expect(router.state.location.search).toBe('?page=2');
    expect(screen.getByRole('button', { name: 'Page 2' })).toHaveAttribute('aria-current', 'page');
  });

  it('filters by name and status, resetting to the first page', async () => {
    const { user, router } = renderPage('/rick-and-morty?page=2');
    await screen.findByText('Showing 21–40 of 45');

    await user.type(screen.getByRole('searchbox', { name: 'Search by name' }), 'smith');
    expect(await screen.findByText('Showing 1–2 of 2 matches')).toBeInTheDocument();
    expect(characterNames()).toEqual(['Morty Smith', 'Summer Smith']);

    await user.click(screen.getByRole('radio', { name: 'Alive' }));
    await user.selectOptions(screen.getByRole('combobox', { name: 'Gender' }), 'Female');

    expect(await screen.findByText('Showing 1–1 of 1 match')).toBeInTheDocument();
    expect(characterNames()).toEqual(['Summer Smith']);
    expect(Object.fromEntries(new URLSearchParams(router.state.location.search))).toEqual({
      name: 'smith',
      status: 'alive',
      gender: 'female',
    });
  });

  it('restores filters from a shared URL', async () => {
    renderPage('/rick-and-morty?species=alien');

    expect(await screen.findByRole('link', { name: 'Birdperson' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Species' })).toHaveValue('alien');
  });

  it('shows an empty state that can clear the filters', async () => {
    const { user, router } = renderPage('/rick-and-morty?name=nobody');

    expect(
      await screen.findByRole('heading', { name: 'No matches in this dimension' }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Clear filters' }));

    expect(await screen.findByRole('link', { name: 'Rick Sanchez' })).toBeInTheDocument();
    expect(router.state.location.search).toBe('');
    expect(screen.getByRole('searchbox', { name: 'Search by name' })).toHaveValue('');
  });

  it('shows an error state and recovers on retry', async () => {
    server.use(
      http.get(`${API_URL}/character`, () => new HttpResponse(null, { status: 500 }), {
        once: true,
      }),
    );
    const { user } = renderPage();

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Portal malfunction');

    await user.click(within(alert).getByRole('button', { name: 'Try again' }));

    expect(await screen.findByRole('link', { name: 'Rick Sanchez' })).toBeInTheDocument();
  });

  it('opens a character and goes back to the same filtered list', async () => {
    const { user, router } = renderPage('/rick-and-morty?name=bird');

    await user.click(await screen.findByRole('link', { name: 'Birdperson' }));
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Birdperson' }),
    ).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/rick-and-morty/characters/47');

    await user.click(screen.getByRole('link', { name: 'All characters' }));

    expect(await screen.findByRole('link', { name: 'Birdperson' })).toBeInTheDocument();
    expect(router.state.location.search).toBe('?name=bird');
  });
});
