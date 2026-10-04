import { screen, waitFor, within } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { apiConfig } from '@/config/apis';
import { i18n } from '@/i18n/i18n';
import { renderRoutes } from '@/test/render';
import { server } from '@/test/server';
import { testRoutes } from '../test/routes';

const API = apiConfig.harryPotter.baseUrl;

const renderDetail = (slug: string) =>
  renderRoutes(testRoutes, { initialEntry: `/harry-potter/${slug}` });

const particular = (label: string) =>
  within(screen.getByRole('region', { name: 'Particulars' })).getByText(label).nextElementSibling;

describe('CharacterDetailPage (Harry Potter)', () => {
  it('shows the house, the known particulars and the non-empty lists', async () => {
    renderDetail('harry-potter');

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Harry James Potter' }),
    ).toBeVisible();
    expect(screen.getByText('Gryffindor')).toBeVisible();
    expect(particular('Blood status')).toHaveTextContent('Half-blood');
    expect(particular('Patronus')).toHaveTextContent('Stag');
    expect(particular('Eyes')).toHaveTextContent('Bright green');
    // Facts the API doesn't have are left out instead of listed as unknown.
    expect(
      within(screen.getByRole('region', { name: 'Particulars' })).queryByText('Boggart'),
    ).not.toBeInTheDocument();

    const aliases = screen.getByRole('region', { name: 'Also known as (2)' });
    expect(
      within(aliases)
        .getAllByRole('listitem')
        .map((item) => item.textContent),
    ).toEqual(['The Boy Who Lived', 'The Chosen One']);
    expect(screen.getByRole('region', { name: 'Wands (1)' })).toBeVisible();
    expect(screen.queryByRole('region', { name: /Romances/ })).not.toBeInTheDocument();
    expect(document.title).toBe('Harry James Potter · Harry Potter · Universe Explorer');
  });

  it('collapses long lists behind an accessible toggle', async () => {
    const { user } = renderDetail('harry-potter');

    const family = await screen.findByRole('region', { name: 'Family (10)' });
    expect(within(family).getAllByRole('listitem')).toHaveLength(8);
    const toggle = within(family).getByRole('button', { name: 'Show all (10)' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');

    await user.click(toggle);

    expect(within(family).getAllByRole('listitem')).toHaveLength(10);
    expect(within(family).getByRole('button', { name: 'Show fewer' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('renders instantly from the list, without requesting the character again', async () => {
    let detailRequests = 0;
    server.events.on('request:start', ({ request }) => {
      if (new URL(request.url).pathname.endsWith('/characters/draco-malfoy')) detailRequests++;
    });
    const { user } = renderRoutes(testRoutes, { initialEntry: '/harry-potter' });

    await user.click(await screen.findByRole('link', { name: 'Draco Lucius Malfoy' }));

    expect(screen.getByRole('heading', { level: 1, name: 'Draco Lucius Malfoy' })).toBeVisible();
    expect(detailRequests).toBe(0);
    server.events.removeAllListeners();
  });

  it('goes back to the filtered list it came from', async () => {
    const { user, router } = renderRoutes(testRoutes, {
      initialEntry: '/harry-potter?house=gryffindor',
    });

    await user.click(await screen.findByRole('link', { name: 'Hermione Jean Granger' }));
    await user.click(screen.getByRole('link', { name: 'All records' }));

    await waitFor(() => expect(router.state.location.search).toBe('?house=gryffindor'));
    expect(await screen.findByText(/matches$/)).toBeVisible();
  });

  it('labels the file in Spanish while keeping API values', async () => {
    await i18n.changeLanguage('es');
    renderDetail('harry-potter');

    expect(await screen.findByRole('region', { name: 'Datos personales' })).toBeVisible();
    expect(
      within(screen.getByRole('region', { name: 'Datos personales' })).getByText(
        'Estatus de sangre',
      ).nextElementSibling,
    ).toHaveTextContent('Half-blood');
  });

  it('shows "not found" for unknown slugs, and rejects malformed ones without a request', async () => {
    let requests = 0;
    server.events.on('request:start', () => {
      requests++;
    });
    renderDetail('Not%20a%20slug!');
    expect(screen.getByRole('heading', { level: 1, name: 'No such entry' })).toBeVisible();
    expect(requests).toBe(0);
    server.events.removeAllListeners();
  });

  it('shows "not found" when the API has no such character', async () => {
    renderDetail('no-such-wizard');

    expect(await screen.findByRole('heading', { level: 1, name: 'No such entry' })).toBeVisible();
  });

  it('shows an error with retry for other failures', async () => {
    server.use(
      http.get(`${API}/characters/:slug`, () => new HttpResponse(null, { status: 503 }), {
        once: true,
      }),
    );
    const { user } = renderDetail('harry-potter');

    const alert = await screen.findByRole('alert');
    await user.click(within(alert).getByRole('button', { name: 'Try again' }));

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Harry James Potter' }),
    ).toBeVisible();
  });
});
