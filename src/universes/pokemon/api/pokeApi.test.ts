import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { apiConfig, assetConfig } from '@/config/apis';
import { HttpError } from '@/shared/api/httpClient';
import { server } from '@/test/server';
import { createPokemonDto } from '../test/fixtures';
import { getPokedexIndex, getPokemon, getPokemonSpecies, getPokemonType } from './pokeApi';

const API = apiConfig.pokemon.baseUrl;

describe('getPokedexIndex', () => {
  it('returns every species with its Pokédex number, in Pokédex order', async () => {
    const index = await getPokedexIndex();

    expect(index).toHaveLength(30);
    expect(index[0]).toEqual({ id: 1, name: 'bulbasaur' });
    expect(index[24]).toEqual({ id: 25, name: 'pikachu' });
  });

  it('requests the whole list at once and skips malformed entries', async () => {
    let limit: string | null = null;
    server.use(
      http.get(`${API}/pokemon-species`, ({ request }) => {
        limit = new URL(request.url).searchParams.get('limit');
        return HttpResponse.json({
          count: 3,
          next: null,
          previous: null,
          results: [
            { name: 'ivysaur', url: `${API}/pokemon-species/2/` },
            { name: 'broken', url: `${API}/pokemon-species/` },
            { name: 'bulbasaur', url: `${API}/pokemon-species/1/` },
          ],
        });
      }),
    );

    const index = await getPokedexIndex();

    expect(Number(limit)).toBeGreaterThan(1025);
    expect(index).toEqual([
      { id: 1, name: 'bulbasaur' },
      { id: 2, name: 'ivysaur' },
    ]);
  });
});

describe('getPokemon', () => {
  it('maps the payload to a compact model', async () => {
    const pokemon = await getPokemon(1);

    expect(pokemon).toMatchObject({
      id: 1,
      name: 'bulbasaur',
      types: ['grass', 'poison'],
      height: 4,
      weight: 60,
      artworkUrl: 'https://img.example.test/1.png',
    });
    expect(pokemon.stats).toHaveLength(6);
    expect(pokemon.stats[0]).toEqual({ name: 'hp', value: 35 });
  });

  it('orders abilities by slot and keeps whether they are hidden', async () => {
    const { abilities } = await getPokemon(25);

    expect(abilities).toEqual([
      { name: 'static', isHidden: false },
      { name: 'lightning-rod', isHidden: true },
    ]);
  });

  it('ignores non-battle types and falls back to the derived artwork URL', async () => {
    const dto = createPokemonDto(132, 'ditto', ['normal', 'stellar']);
    dto.sprites = {};
    server.use(http.get(`${API}/pokemon/132`, () => HttpResponse.json(dto)));

    const pokemon = await getPokemon(132);

    expect(pokemon.types).toEqual(['normal']);
    expect(pokemon.artworkUrl).toBe(
      `${assetConfig.pokemonSpritesBaseUrl}/other/official-artwork/132.png`,
    );
  });

  it('throws a 404 HttpError for unknown Pokémon', async () => {
    const error = await getPokemon(99_999).catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(HttpError);
    expect(error).toMatchObject({ status: 404 });
  });
});

describe('getPokemonSpecies', () => {
  it('keeps the localized texts provided by the API', async () => {
    const species = await getPokemonSpecies(25);

    expect(species.genus).toMatchObject({ en: 'Mouse Pokémon', es: 'Pokémon Ratón' });
    expect(species.generation).toBe(1);
  });

  it('keeps the most recent Pokédex entry per language, as plain prose', async () => {
    const { flavorText } = await getPokemonSpecies(25);

    expect(flavorText).toEqual({ en: 'Newest entry.', es: 'Entrada más reciente.' });
  });
});

describe('getPokemonType', () => {
  it('lists species of a type in Pokédex order, without alternate forms', async () => {
    const electric = await getPokemonType('electric');

    expect(electric.pokedexIds).toEqual([25, 26]);
    expect(electric.names).toMatchObject({ en: 'Electric', es: 'Eléctrico' });
  });
});
