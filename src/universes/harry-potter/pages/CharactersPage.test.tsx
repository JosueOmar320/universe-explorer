import { screen, waitFor, within } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { apiConfig } from '@/config/apis';
import { i18n } from '@/i18n/i18n';
import { renderRoutes } from '@/test/render';
import { server } from '@/test/server';
import { testRoutes } from '../test/routes';

const API = apiConfig.harryPotter.baseUrl;

const renderPage = (initialEntry = '/harry-potter') => renderRoutes(testRoutes, { initialEntry });

const cardFor = (name: string) =>
  screen.getByRole('heading', { level: 3, name }).closest('article') as HTMLElement;

describe('CharactersPage (Harry Potter)', () => {
  it('lists Hogwarts students by default, sorted by name', async () => {
    renderPage();

    expect(screen.getByRole('status')).toHaveTextContent('Consulting the registry');
    expect(await screen.findByText('Showing 1–24 of 29')).toBeVisible();
    const names = screen
      .getAllByRole('article')
      .map((card) => within(card).getByRole('heading').textContent);
    expect(names.slice(0, 3)).toEqual([
      'Cedric Diggory',
      'Draco Lucius Malfoy',
      'Harry James Potter',
    ]);
    // Hedwig has no house, so she's not among the students.
    expect(screen.queryByRole('heading', { name: 'Hedwig' })).not.toBeInTheDocument();
  });

  it('shows the house and key facts on each card, with "Unknown" for gaps', async () => {
    renderPage();
    await screen.findByText('Showing 1–24 of 29');

    const harry = cardFor('Harry James Potter');
    expect(within(harry).getByText('Gryffindor')).toBeVisible();
    expect(within(harry).getByText('Blood status').nextElementSibling).toHaveTextContent(
      'Half-blood',
    );
    expect(within(harry).getByText('Patronus').nextElementSibling).toHaveTextContent('Stag');
    const draco = cardFor('Draco Lucius Malfoy');
    expect(within(draco).getByText('Patronus').nextElementSibling).toHaveTextContent('Unknown');
  });

  it('shows students per house and the size of the whole registry', async () => {
    renderPage();

    const houses = await screen.findByRole('figure', { name: 'Students per house' });
    await waitFor(() =>
      expect(within(houses).getByText('Gryffindor').nextElementSibling).toHaveTextContent('8'),
    );
    expect(within(houses).getByText('Slytherin').nextElementSibling).toHaveTextContent('7');
    expect(await screen.findByText('All records')).toBeVisible();
    await waitFor(() =>
      expect(screen.getByText('All records').nextElementSibling).toHaveTextContent('30'),
    );
  });

  it('prefetches the next page, then paginates through the URL', async () => {
    let prefetched = false;
    server.events.on('request:start', ({ request }) => {
      if (new URL(request.url).searchParams.get('page[number]') === '2') prefetched = true;
    });
    const { user, router } = renderPage();
    await screen.findByText('Showing 1–24 of 29');
    await waitFor(() => expect(prefetched).toBe(true));

    await user.click(screen.getByRole('button', { name: 'Next page' }));

    expect(await screen.findByText('Showing 25–29 of 29')).toBeVisible();
    expect(router.state.location.search).toBe('?page=2');
    server.events.removeAllListeners();
  });

  it('renders its own copy in Spanish', async () => {
    await i18n.changeLanguage('es');
    renderPage();

    expect(await screen.findByText('Mostrando 1–24 de 29')).toBeVisible();
    expect(within(cardFor('Harry James Potter')).getByText('Estatus de sangre')).toBeVisible();
  });

  it('shows an error state with retry when the registry is unreachable', async () => {
    // Fail only the listing request once; the hero's per-house counts still succeed.
    let failed = false;
    server.use(
      http.get(`${API}/characters`, ({ request }) => {
        const isListing = new URL(request.url).searchParams.has('filter[house_in][]');
        if (!isListing || failed) return undefined;
        failed = true;
        return new HttpResponse(null, { status: 503 });
      }),
    );
    const { user } = renderPage();

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('The registry is unreachable');
    await user.click(within(alert).getByRole('button', { name: 'Try again' }));

    expect(await screen.findByText('Showing 1–24 of 29')).toBeVisible();
  });

  describe('search and house filter', () => {
    const cardNames = () =>
      screen.getAllByRole('article').map((card) => within(card).getByRole('heading').textContent);

    it('searches by name on the server and keeps the search in the URL', async () => {
      const { user, router } = renderPage();
      await screen.findByText('Showing 1–24 of 29');

      await user.type(screen.getByRole('searchbox', { name: 'Search by name' }), 'potter');

      expect(await screen.findByText('Showing 1–1 of 1 match')).toBeVisible();
      expect(cardNames()).toEqual(['Harry James Potter']);
      expect(router.state.location.search).toBe('?q=potter');
    });

    it('filters by house instantly, reusing the page cached by the hero', async () => {
      let ravenclawRequests = 0;
      server.events.on('request:start', ({ request }) => {
        if (new URL(request.url).searchParams.get('filter[house_eq]') === 'Ravenclaw') {
          ravenclawRequests++;
        }
      });
      const { user, router } = renderPage();
      await screen.findByText('Showing 1–24 of 29');
      await waitFor(() => expect(ravenclawRequests).toBe(1));

      await user.click(screen.getByRole('radio', { name: 'Ravenclaw' }));

      expect(await screen.findByText('Showing 1–7 of 7 matches')).toBeVisible();
      expect(cardNames()[0]).toBe('Hogwarts student 03');
      expect(router.state.location.search).toBe('?house=ravenclaw');
      expect(ravenclawRequests).toBe(1);
      server.events.removeAllListeners();
    });

    it('finds characters without a house only when showing everyone', async () => {
      const { user } = renderPage('/harry-potter?q=hedwig');

      expect(await screen.findByRole('heading', { name: 'No entries match' })).toBeVisible();

      await user.click(screen.getByRole('radio', { name: 'Everyone' }));

      expect(await screen.findByRole('heading', { level: 3, name: 'Hedwig' })).toBeVisible();
      expect(within(cardFor('Hedwig')).getByText('No house')).toBeVisible();
    });

    it('restores filters from a shared URL and clears them', async () => {
      const { user, router } = renderPage('/harry-potter?house=slytherin&q=malfoy');

      expect(
        await screen.findByRole('heading', { level: 3, name: 'Draco Lucius Malfoy' }),
      ).toBeVisible();
      expect(screen.getByRole('radio', { name: 'Slytherin' })).toBeChecked();
      expect(screen.getByRole('searchbox', { name: 'Search by name' })).toHaveValue('malfoy');

      await user.click(screen.getByRole('button', { name: 'Clear 2 active filters' }));

      expect(await screen.findByText('Showing 1–24 of 29')).toBeVisible();
      expect(router.state.location.search).toBe('');
      expect(screen.getByRole('radio', { name: 'Hogwarts students' })).toBeChecked();
    });
  });
});
