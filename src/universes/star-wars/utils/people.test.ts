import { describe, expect, it } from 'vitest';
import type { Person } from '../api/models';
import { filterPeople, getSpeciesIds } from './people';

const person = (id: number, name: string, overrides: Partial<Person> = {}): Person => ({
  id,
  name,
  heightCm: null,
  massKg: null,
  birthYear: null,
  gender: null,
  hairColor: null,
  skinColor: null,
  eyeColor: null,
  homeworldId: null,
  speciesIds: [],
  filmIds: [],
  starshipIds: [],
  vehicleIds: [],
  ...overrides,
});

const people = [
  person(1, 'Luke Skywalker', { filmIds: [1, 2] }),
  person(3, 'R2-D2', { filmIds: [1, 2], speciesIds: [2] }),
  person(11, 'Anakin Skywalker', { filmIds: [4] }),
];

const names = (result: Person[]) => result.map(({ name }) => name);

describe('getSpeciesIds', () => {
  it('treats an empty species list as Human (#1), like SWAPI', () => {
    expect(getSpeciesIds(people[0]!)).toEqual([1]);
    expect(getSpeciesIds(people[1]!)).toEqual([2]);
  });
});

describe('filterPeople', () => {
  it('searches names ignoring case and punctuation', () => {
    expect(names(filterPeople(people, { query: 'skywalker' }))).toEqual([
      'Luke Skywalker',
      'Anakin Skywalker',
    ]);
    expect(names(filterPeople(people, { query: 'r2d2' }))).toEqual(['R2-D2']);
  });

  it('filters by film and by species, including implicit humans', () => {
    expect(names(filterPeople(people, { filmId: 4 }))).toEqual(['Anakin Skywalker']);
    expect(names(filterPeople(people, { speciesId: 1 }))).toEqual([
      'Luke Skywalker',
      'Anakin Skywalker',
    ]);
  });

  it('combines every filter', () => {
    expect(names(filterPeople(people, { query: 'sky', filmId: 1, speciesId: 1 }))).toEqual([
      'Luke Skywalker',
    ]);
  });
});
