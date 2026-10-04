/**
 * What the end-to-end tests need to know about each universe. Names come from the MSW
 * fixtures in `src/universes/<id>/test/fixtures.ts`.
 */
export interface UniverseCase {
  name: string;
  path: string;
  /** A record visible on the first page of the default listing. */
  firstRecord: string;
  search: { label: string; query: string; result: string };
  detail: { path: string; heading: string };
  backLink: string;
}

export const universes: UniverseCase[] = [
  {
    name: 'Rick and Morty',
    path: '/rick-and-morty',
    firstRecord: 'Rick Sanchez',
    search: { label: 'Search by name', query: 'bird', result: 'Birdperson' },
    detail: { path: '/rick-and-morty/characters/1', heading: 'Rick Sanchez' },
    backLink: 'All characters',
  },
  {
    name: 'Pokémon',
    path: '/pokemon',
    firstRecord: 'Bulbasaur',
    // Pikachu (#25) is on the second page, so finding it proves the search ran.
    search: { label: 'Search by name or number', query: 'pika', result: 'Pikachu' },
    detail: { path: '/pokemon/25', heading: 'Pikachu' },
    backLink: 'All Pokémon',
  },
  {
    name: 'Star Wars',
    path: '/star-wars',
    firstRecord: 'Luke Skywalker',
    search: { label: 'Search by name', query: 'vader', result: 'Darth Vader' },
    detail: { path: '/star-wars/people/1', heading: 'Luke Skywalker' },
    backLink: 'All personnel',
  },
  {
    name: 'Harry Potter',
    path: '/harry-potter',
    firstRecord: 'Cedric Diggory',
    search: { label: 'Search by name', query: 'hermione', result: 'Hermione Jean Granger' },
    detail: { path: '/harry-potter/harry-potter', heading: 'Harry James Potter' },
    backLink: 'All records',
  },
];
