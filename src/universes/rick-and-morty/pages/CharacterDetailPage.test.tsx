import { apiConfig } from '@/config/apis';
import { screen, within } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { renderRoutes } from '@/test/render';
import { server } from '@/test/server';
import { testRoutes } from '../test/routes';

const API_URL = apiConfig.rickAndMorty.baseUrl;

const renderDetail = (id: string) =>
  renderRoutes(testRoutes, { initialEntry: `/rick-and-morty/characters/${id}` });

describe('CharacterDetailPage', () => {
  it('shows the profile and the episode log grouped by season', async () => {
    renderDetail('1');

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Rick Sanchez' }),
    ).toBeInTheDocument();
    expect(document.title).toBe('Rick Sanchez · Rick and Morty · Universe Explorer');

    const season1 = await screen.findByRole('region', { name: /Season 1/ });
    expect(within(season1).getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByRole('region', { name: /Season 2/ })).toHaveTextContent('A Rickle in Time');
    expect(screen.getByText('First seen in').nextElementSibling).toHaveTextContent('S01E01 Pilot');
  });

  it('shows "not found" for unknown characters', async () => {
    renderDetail('9999');

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Character not found' }),
    ).toBeInTheDocument();
  });

  it('rejects invalid ids without calling the API', async () => {
    let requests = 0;
    server.use(
      http.get(`${API_URL}/character/:id`, () => {
        requests++;
        return HttpResponse.json({});
      }),
    );

    renderDetail('abc');

    expect(
      screen.getByRole('heading', { level: 1, name: 'Character not found' }),
    ).toBeInTheDocument();
    expect(requests).toBe(0);
  });

  it('keeps the profile visible when only the episodes fail', async () => {
    server.use(http.get(`${API_URL}/episode/:ids`, () => new HttpResponse(null, { status: 500 })));
    renderDetail('1');

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Rick Sanchez' }),
    ).toBeInTheDocument();
    expect(await screen.findByRole('alert')).toHaveTextContent('Episodes unavailable');
  });
});
