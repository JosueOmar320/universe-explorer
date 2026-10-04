import { screen, waitFor, within } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { apiConfig } from '@/config/apis';
import { i18n } from '@/i18n/i18n';
import { renderRoutes } from '@/test/render';
import { server } from '@/test/server';
import { testRoutes } from '../test/routes';

const API = apiConfig.pokemon.baseUrl;

const renderPage = (initialEntry = '/pokemon') => renderRoutes(testRoutes, { initialEntry });

const cardFor = (name: string) =>
  screen.getByRole('heading', { level: 3, name }).closest('article') as HTMLElement;

describe('PokedexPage', () => {
  it('shows a loading state, then the first page of the Pokédex', async () => {
    renderPage();

    expect(screen.getByRole('status')).toHaveTextContent('Loading Pokédex');
    expect(await screen.findByRole('heading', { level: 3, name: 'Bulbasaur' })).toBeVisible();
    expect(screen.getAllByRole('article')).toHaveLength(24);
    expect(screen.getByText('Showing 1–24 of 30')).toBeInTheDocument();
  });

  it('shows number, name and types on each card', async () => {
    renderPage();
    await screen.findByRole('heading', { level: 3, name: 'Charmander' });

    const charmander = cardFor('Charmander');
    expect(within(charmander).getByText('#0004')).toBeInTheDocument();
    const types = await within(charmander).findByRole('list', { name: 'Types' });
    expect(within(types).getByText('Fire')).toBeInTheDocument();
    const bulbasaurTypes = await within(cardFor('Bulbasaur')).findByRole('list', { name: 'Types' });
    expect(within(bulbasaurTypes).getAllByRole('listitem')).toHaveLength(2);
  });

  it('takes the card types from the type lists, primary type first', async () => {
    // A Pokémon's own record is ~300 kB of JSON: 24 of them per page blocked the main thread.
    const pokemonRequests: string[] = [];
    const recordPokemonRequests = ({ request }: { request: Request }) => {
      if (/\/pokemon\/\d+$/.test(new URL(request.url).pathname)) pokemonRequests.push(request.url);
    };
    server.events.on('request:start', recordPokemonRequests);
    try {
      renderPage();
      await screen.findByRole('heading', { level: 3, name: 'Bulbasaur' });

      const types = await within(cardFor('Bulbasaur')).findByRole('list', { name: 'Types' });

      expect(
        within(types)
          .getAllByRole('listitem')
          .map((item) => item.textContent),
      ).toEqual(['Grass', 'Poison']);
      expect(pokemonRequests).toEqual([]);
    } finally {
      server.events.removeListener('request:start', recordPokemonRequests);
    }
  });

  it('paginates locally, without downloading the index again', async () => {
    let indexRequests = 0;
    server.events.on('request:start', ({ request }) => {
      if (new URL(request.url).pathname.endsWith('/pokemon-species')) indexRequests++;
    });
    const { user, router } = renderPage();
    await screen.findByRole('heading', { level: 3, name: 'Bulbasaur' });

    await user.click(screen.getByRole('button', { name: 'Next page' }));

    expect(await screen.findByText('Showing 25–30 of 30')).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(6);
    expect(router.state.location.search).toBe('?page=2');
    expect(indexRequests).toBe(1);
    server.events.removeAllListeners();
  });

  it('uses the official Spanish type names provided by the API', async () => {
    await i18n.changeLanguage('es');
    renderPage('/pokemon?page=2');

    await screen.findByRole('heading', { level: 3, name: 'Pikachu' });
    const types = await within(cardFor('Pikachu')).findByRole('list', { name: 'Tipos' });
    expect(await within(types).findByText('Eléctrico')).toBeInTheDocument();
    expect(screen.getByText('Mostrando 25–30 de 30')).toBeInTheDocument();
  });

  it('still lists a Pokémon whose types fail to load', async () => {
    server.use(http.get(`${API}/type/fire`, () => new HttpResponse(null, { status: 500 })));
    renderPage();

    await screen.findByRole('heading', { level: 3, name: 'Charmander' });
    const charmander = cardFor('Charmander');
    // The types placeholder goes away once the (failed) request has settled.
    await waitFor(() => expect(charmander.querySelector('[aria-hidden="true"]')).toBeNull());

    expect(within(charmander).getByText('#0004')).toBeInTheDocument();
    expect(within(charmander).queryByRole('list', { name: 'Types' })).not.toBeInTheDocument();
  });

  it('shows an error state when the Pokédex cannot be loaded, and recovers on retry', async () => {
    server.use(
      http.get(`${API}/pokemon-species`, () => new HttpResponse(null, { status: 503 }), {
        once: true,
      }),
    );
    const { user } = renderPage();

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent("The Pokédex isn't responding");

    await user.click(within(alert).getByRole('button', { name: 'Try again' }));

    expect(await screen.findByRole('heading', { level: 3, name: 'Bulbasaur' })).toBeVisible();
  });

  it('handles pages beyond the end of the Pokédex', async () => {
    const { user, router } = renderPage('/pokemon?page=99');

    expect(await screen.findByRole('heading', { name: 'No Pokémon on this page' })).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Go to first page' }));

    expect(await screen.findByRole('heading', { level: 3, name: 'Bulbasaur' })).toBeVisible();
    expect(router.state.location.search).toBe('');
  });

  describe('search and type filter', () => {
    const cardNames = () =>
      screen.getAllByRole('article').map((card) => within(card).getByRole('heading').textContent);

    it('searches by name locally and keeps the search in the URL', async () => {
      const { user, router } = renderPage();
      await screen.findByRole('heading', { level: 3, name: 'Bulbasaur' });

      await user.type(screen.getByRole('searchbox', { name: 'Search by name or number' }), 'char');

      expect(await screen.findByText('Showing 1–3 of 3 matches')).toBeInTheDocument();
      expect(cardNames()).toEqual(['Charmander', 'Charmeleon', 'Charizard']);
      expect(router.state.location.search).toBe('?q=char');
    });

    it('searches by Pokédex number', async () => {
      renderPage('/pokemon?q=%2325');

      expect(await screen.findByText('Showing 1–1 of 1 match')).toBeInTheDocument();
      expect(cardNames()).toEqual(['Pikachu']);
    });

    it('filters by type, combines it with the search and resets the page', async () => {
      const { user, router } = renderPage('/pokemon?page=2');
      await screen.findByRole('heading', { level: 3, name: 'Pikachu' });

      await user.click(screen.getByRole('radio', { name: 'Fire' }));

      expect(await screen.findByText('Showing 1–3 of 3 matches')).toBeInTheDocument();
      expect(cardNames()).toEqual(['Charmander', 'Charmeleon', 'Charizard']);
      expect(router.state.location.search).toBe('?type=fire');

      await user.type(screen.getByRole('searchbox', { name: 'Search by name or number' }), 'iza');

      expect(await screen.findByText('Showing 1–1 of 1 match')).toBeInTheDocument();
      expect(cardNames()).toEqual(['Charizard']);
    });

    it('restores filters from a shared URL', async () => {
      renderPage('/pokemon?type=electric&q=rai');

      expect(await screen.findByRole('heading', { level: 3, name: 'Raichu' })).toBeVisible();
      expect(screen.getByRole('radio', { name: 'Electric' })).toBeChecked();
      expect(screen.getByRole('searchbox', { name: 'Search by name or number' })).toHaveValue(
        'rai',
      );
    });

    it('shows an empty state that clears every filter', async () => {
      const { user, router } = renderPage('/pokemon?q=zzz&type=fire');

      expect(await screen.findByRole('heading', { name: 'No Pokémon match' })).toBeVisible();
      await user.click(screen.getByRole('button', { name: 'Clear filters' }));

      expect(await screen.findByRole('heading', { level: 3, name: 'Bulbasaur' })).toBeVisible();
      expect(router.state.location.search).toBe('');
      expect(screen.getByRole('radio', { name: 'All' })).toBeChecked();
    });

    it('labels types with the official names in the selected language', async () => {
      await i18n.changeLanguage('es');
      renderPage();

      expect(await screen.findByRole('radio', { name: 'Fuego' })).toBeInTheDocument();
      expect(screen.getByRole('radio', { name: 'Todos' })).toBeChecked();
    });
  });
});
