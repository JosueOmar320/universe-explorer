import { screen, waitFor, within } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { apiConfig } from '@/config/apis';
import { i18n } from '@/i18n/i18n';
import { renderRoutes } from '@/test/render';
import { server } from '@/test/server';
import { testRoutes } from '../test/routes';

const API = apiConfig.pokemon.baseUrl;

const renderDetail = (id: string) => renderRoutes(testRoutes, { initialEntry: `/pokemon/${id}` });

describe('PokemonDetailPage', () => {
  it('shows the profile, Pokédex entry and base stats', async () => {
    renderDetail('25');

    expect(await screen.findByRole('heading', { level: 1, name: 'Pikachu' })).toBeVisible();
    expect(await screen.findByText('Mouse Pokémon')).toBeVisible();
    expect(screen.getByText('Newest entry.')).toBeVisible();
    expect(screen.getByText('Generation I')).toBeVisible();
    expect(screen.getByRole('img', { name: 'Official artwork of Pikachu' })).toBeVisible();
    expect(screen.getByText('Height').nextElementSibling).toHaveTextContent('0.4 m');
    expect(screen.getByText('Weight').nextElementSibling).toHaveTextContent('6 kg');
    expect(screen.getByText('Lightning Rod').parentElement).toHaveTextContent('(hidden ability)');

    const stats = screen.getByRole('region', { name: 'Base stats' });
    expect(within(stats).getByText('HP').nextElementSibling).toHaveTextContent('35');
    expect(within(stats).getByText('Total').nextElementSibling).toHaveTextContent('320');
    expect(document.title).toBe('Pikachu · Pokémon · Universe Explorer');
  });

  it('shows the API’s own Spanish texts and localized units', async () => {
    await i18n.changeLanguage('es');
    renderDetail('25');

    expect(await screen.findByText('Pokémon Ratón')).toBeVisible();
    expect(screen.getByText('Entrada más reciente.')).toBeVisible();
    expect(screen.getByText('Generación I')).toBeVisible();
    expect(screen.getByText('Altura').nextElementSibling).toHaveTextContent('0,4 m');
    expect(screen.getByRole('region', { name: 'Estadísticas base' })).toHaveTextContent('PS');
  });

  it('still renders when the localized species data is unavailable', async () => {
    // The fixtures only include species data for #25.
    renderDetail('4');

    expect(await screen.findByRole('heading', { level: 1, name: 'Charmander' })).toBeVisible();
    expect(screen.getByRole('region', { name: 'Base stats' })).toBeVisible();
    expect(screen.queryByText('Pokédex entry')).not.toBeInTheDocument();
  });

  it('shows "not found" for unknown numbers, and rejects invalid ones without a request', async () => {
    let requests = 0;
    server.events.on('request:start', ({ request }) => {
      if (request.url.includes('/pokemon/abc')) requests++;
    });

    renderDetail('abc');
    expect(screen.getByRole('heading', { level: 1, name: 'Pokémon not found' })).toBeVisible();
    expect(requests).toBe(0);
    server.events.removeAllListeners();
  });

  it('shows "not found" when the API has no such Pokémon', async () => {
    renderDetail('9999');

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Pokémon not found' }),
    ).toBeVisible();
  });

  it('shows an error with retry for other failures', async () => {
    server.use(
      http.get(`${API}/pokemon/25`, () => new HttpResponse(null, { status: 503 }), { once: true }),
    );
    const { user } = renderDetail('25');

    const alert = await screen.findByRole('alert');
    await user.click(within(alert).getByRole('button', { name: 'Try again' }));

    expect(await screen.findByRole('heading', { level: 1, name: 'Pikachu' })).toBeVisible();
  });

  it('browses to the previous and next Pokémon', async () => {
    const { user, router } = renderDetail('25');
    const neighbours = await screen.findByRole('navigation', { name: 'Pokédex neighbours' });

    expect(
      await within(neighbours).findByRole('link', { name: 'Previous Pokémon: Arbok' }),
    ).toBeVisible();
    await user.click(within(neighbours).getByRole('link', { name: 'Next Pokémon: Raichu' }));

    expect(await screen.findByRole('heading', { level: 1, name: 'Raichu' })).toBeVisible();
    expect(router.state.location.pathname).toBe('/pokemon/26');
  });

  it('returns to the filtered list it came from, even after browsing neighbours', async () => {
    const { user, router } = renderRoutes(testRoutes, { initialEntry: '/pokemon?type=fire' });

    await user.click(await screen.findByRole('link', { name: 'Charmeleon' }));
    expect(await screen.findByRole('heading', { level: 1, name: 'Charmeleon' })).toBeVisible();

    await user.click(await screen.findByRole('link', { name: 'Next Pokémon: Charizard' }));
    expect(await screen.findByRole('heading', { level: 1, name: 'Charizard' })).toBeVisible();

    await user.click(screen.getByRole('link', { name: 'All Pokémon' }));

    await waitFor(() => expect(router.state.location.pathname).toBe('/pokemon'));
    expect(router.state.location.search).toBe('?type=fire');
    expect(await screen.findByText('Showing 1–3 of 3 matches')).toBeVisible();
  });
});
