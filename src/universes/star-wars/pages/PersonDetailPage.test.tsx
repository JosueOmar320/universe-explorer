import { screen, waitFor, within } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { apiConfig } from '@/config/apis';
import { i18n } from '@/i18n/i18n';
import { renderRoutes } from '@/test/render';
import { server } from '@/test/server';
import { testRoutes } from '../test/routes';

const API = apiConfig.starWars.baseUrl;

const renderDetail = (id: string) =>
  renderRoutes(testRoutes, { initialEntry: `/star-wars/people/${id}` });

const factValue = (container: HTMLElement, label: string) =>
  within(container).getByText(label).nextElementSibling;

describe('PersonDetailPage', () => {
  it('shows the profile, homeworld and species resolved from the archive', async () => {
    renderDetail('1');

    const dossier = await screen.findByRole('article', { name: 'Luke Skywalker' });
    expect(await within(dossier).findByText('Human · Tatooine')).toBeVisible();
    expect(factValue(dossier, 'Height')).toHaveTextContent('172 cm');
    expect(factValue(dossier, 'Hair')).toHaveTextContent('blond');
    expect(factValue(dossier, 'Climate')).toHaveTextContent('arid');
    expect(factValue(dossier, 'Population')).toHaveTextContent('200K');
    expect(factValue(dossier, 'Language')).toHaveTextContent('Galactic Basic');
    expect(document.title).toBe('Luke Skywalker · Star Wars · Universe Explorer');
  });

  it('lists films in story order, and starships and vehicles by name', async () => {
    renderDetail('1');

    const films = await screen.findByRole('region', { name: 'Filmography' });
    const rows = await within(films).findAllByRole('listitem');
    expect(rows.map((row) => row.textContent)).toEqual([
      'IVA New Hope1977 · Directed by George Lucas',
      'VThe Empire Strikes Back1980 · Directed by Irvin Kershner',
    ]);
    expect(within(rows[0]!).getByLabelText('Episode IV')).toBeVisible();

    const craft = screen.getByRole('region', { name: 'Starships & vehicles' });
    expect(await within(craft).findByText('X-wing')).toBeVisible();
    expect(await within(craft).findByText('Snowspeeder')).toBeVisible();
  });

  it('shows "Unknown" for missing data and "None on record" for empty lists', async () => {
    renderDetail('2');

    const dossier = await screen.findByRole('article', { name: 'C-3PO' });
    expect(factValue(dossier, 'Gender')).toHaveTextContent('Unknown');
    expect(await within(dossier).findByText('Droid · Tatooine')).toBeVisible();
    expect(within(dossier).getAllByText('None on record')).toHaveLength(2);
  });

  it('renders its own copy and number formats in Spanish', async () => {
    await i18n.changeLanguage('es');
    renderDetail('1');

    const dossier = await screen.findByRole('article', { name: 'Luke Skywalker' });
    await within(dossier).findByText('Human · Tatooine');
    expect(factValue(dossier, 'Población')).toHaveTextContent('200 mil');
    expect(within(dossier).getByText(/Dirigida por George Lucas/)).toBeVisible();
  });

  it('shows "not found" for unknown or invalid record numbers', async () => {
    renderDetail('999');
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Record not found' }),
    ).toBeVisible();
  });

  it('shows an error with retry when the archive fails', async () => {
    server.use(
      http.get(`${API}/people`, () => new HttpResponse(null, { status: 503 }), { once: true }),
    );
    const { user } = renderDetail('1');

    const alert = await screen.findByRole('alert');
    await user.click(within(alert).getByRole('button', { name: 'Try again' }));

    expect(await screen.findByRole('heading', { level: 1, name: 'Luke Skywalker' })).toBeVisible();
  });

  it('opens a record from the filtered list and goes back to it', async () => {
    const { user, router } = renderRoutes(testRoutes, { initialEntry: '/star-wars?episode=5' });

    await user.click(await screen.findByRole('link', { name: 'Luke Skywalker' }));
    expect(await screen.findByRole('heading', { level: 1, name: 'Luke Skywalker' })).toBeVisible();

    await user.click(screen.getByRole('link', { name: 'All personnel' }));

    await waitFor(() => expect(router.state.location.search).toBe('?episode=5'));
    expect(await screen.findByText('Showing 1–1 of 1 match')).toBeVisible();
  });
});
