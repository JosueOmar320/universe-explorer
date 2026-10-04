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
});
