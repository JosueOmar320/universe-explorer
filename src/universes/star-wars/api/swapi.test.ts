import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { apiConfig } from '@/config/apis';
import { server } from '@/test/server';
import { createPersonDto } from '../test/fixtures';
import { getFilms, getPeople, getPlanets, getSpecies, getStarships, getVehicles } from './swapi';

const API = apiConfig.starWars.baseUrl;

describe('getPeople', () => {
  it('returns every person, sorted by id, with typed values and ids instead of URLs', async () => {
    const people = await getPeople();

    expect(people.slice(0, 5).map(({ id }) => id)).toEqual([1, 2, 4, 16, 30]);
    expect(people[0]).toEqual({
      id: 1,
      name: 'Luke Skywalker',
      heightCm: 172,
      massKg: 77,
      birthYear: '19BBY',
      gender: 'male',
      hairColor: 'blond',
      skinColor: 'fair',
      eyeColor: 'blue',
      homeworldId: 1,
      speciesIds: [],
      filmIds: [1, 2],
      starshipIds: [12],
      vehicleIds: [14],
    });
  });

  it("normalizes SWAPI's odd values", async () => {
    const people = await getPeople();
    const jabba = people.find(({ name }) => name.startsWith('Jabba'));
    const threepio = people.find(({ name }) => name === 'C-3PO');
    const vader = people.find(({ name }) => name === 'Darth Vader');

    expect(jabba).toMatchObject({ massKg: 1358, hairColor: null, speciesIds: [5] });
    expect(threepio).toMatchObject({ gender: null, speciesIds: [2] });
    expect(vader).toMatchObject({ massKg: null, hairColor: null });
  });

  it('skips entries without a valid resource URL', async () => {
    server.use(
      http.get(`${API}/people`, () =>
        HttpResponse.json([
          createPersonDto(1, 'Luke Skywalker'),
          createPersonDto(0, 'Broken', { url: `${API}/people/` }),
        ]),
      ),
    );

    expect((await getPeople()).map(({ name }) => name)).toEqual(['Luke Skywalker']);
  });
});

describe('getPlanets / getSpecies', () => {
  it('maps planets with numeric populations', async () => {
    const planets = await getPlanets();

    expect(planets[0]).toEqual({
      id: 1,
      name: 'Tatooine',
      climate: 'arid',
      terrain: 'desert',
      population: 200000,
    });
    expect(planets.find(({ id }) => id === 28)).toMatchObject({ climate: null, population: null });
  });

  it('maps species', async () => {
    expect(await getSpecies()).toEqual([
      { id: 1, name: 'Human', classification: 'mammal', language: 'Galactic Basic' },
      { id: 2, name: 'Droid', classification: 'artificial', language: null },
      { id: 5, name: 'Hutt', classification: 'gastropod', language: 'Huttese' },
    ]);
  });
});

describe('getFilms', () => {
  it('orders films by episode (story order), not by release', async () => {
    const films = await getFilms();

    expect(films.map(({ episode, title }) => [episode, title])).toEqual([
      [4, 'A New Hope'],
      [5, 'The Empire Strikes Back'],
    ]);
  });
});

describe('getStarships / getVehicles', () => {
  it('maps craft with their class', async () => {
    expect(await getStarships()).toEqual([
      { id: 12, name: 'X-wing', model: 'T-65 X-wing', craftClass: 'Starfighter' },
    ]);
    expect((await getVehicles())[0]).toMatchObject({ id: 14, craftClass: 'airspeeder' });
  });
});
