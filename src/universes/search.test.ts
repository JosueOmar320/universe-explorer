import { QueryClient } from '@tanstack/react-query';
import { describe, expect, it } from 'vitest';
import { getUniverse } from './registry';
import { searchableUniverses } from './search';

const search = (id: string, query: string) => {
  const universe = searchableUniverses.find((candidate) => candidate.id === id);
  if (!universe) throw new Error(`${id} is not searchable`);
  return universe.search(query, new QueryClient(), 5);
};

describe('global search', () => {
  it('covers every available universe, in registry order', () => {
    expect(searchableUniverses.map(({ id }) => id)).toEqual([
      'rick-and-morty',
      'pokemon',
      'star-wars',
      'harry-potter',
    ]);
    expect(searchableUniverses[0]?.name).toBe(getUniverse('rick-and-morty').name);
  });

  it('matches Star Wars names regardless of punctuation', async () => {
    const { hits } = await search('star-wars', 'c3po');

    expect(hits).toEqual([
      { id: '2', name: 'C-3PO', detail: '112BBY', href: '/star-wars/people/2' },
    ]);
  });

  it('caps the hits but reports every match', async () => {
    const { hits, total } = await search('harry-potter', 'hogwarts');

    expect(hits).toHaveLength(5);
    expect(total).toBe(24);
  });

  it('returns no hits (not an error) when the API has no matches', async () => {
    // The Rick and Morty API answers "no results" with a 404.
    expect(await search('rick-and-morty', 'zzz')).toEqual({ hits: [], total: 0 });
  });

  it('links each listing with its own filter parameter', () => {
    const hrefs = Object.fromEntries(
      searchableUniverses.map((universe) => [universe.id, universe.listingHref('mo')]),
    );

    expect(hrefs).toEqual({
      'rick-and-morty': '/rick-and-morty?name=mo',
      pokemon: '/pokemon?q=mo',
      'star-wars': '/star-wars?q=mo',
      'harry-potter': '/harry-potter?q=mo&house=everyone',
    });
  });
});
