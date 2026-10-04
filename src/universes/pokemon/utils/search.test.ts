import { describe, expect, it } from 'vitest';
import type { PokedexEntry } from '../api/models';
import { filterPokedex, normalizeSearchText } from './search';

const entries: PokedexEntry[] = [
  { id: 25, name: 'pikachu' },
  { id: 26, name: 'raichu' },
  { id: 122, name: 'mr-mime' },
  { id: 250, name: 'ho-oh' },
  { id: 669, name: 'flabebe' },
];

const names = (result: PokedexEntry[]) => result.map(({ name }) => name);

describe('normalizeSearchText', () => {
  it('ignores case, accents, spaces and punctuation', () => {
    expect(normalizeSearchText('Mr. Mime')).toBe('mrmime');
    expect(normalizeSearchText('Flabébé')).toBe('flabebe');
  });
});

describe('filterPokedex', () => {
  it('returns everything without a query or type', () => {
    expect(filterPokedex(entries, {})).toHaveLength(entries.length);
    expect(filterPokedex(entries, { query: '   ' })).toHaveLength(entries.length);
  });

  it('matches part of a name, tolerating spaces, punctuation and accents', () => {
    expect(names(filterPokedex(entries, { query: 'chu' }))).toEqual(['pikachu', 'raichu']);
    expect(names(filterPokedex(entries, { query: 'Mr Mime' }))).toEqual(['mr-mime']);
    expect(names(filterPokedex(entries, { query: 'Flabébé' }))).toEqual(['flabebe']);
  });

  it('matches Pokédex numbers that start with a numeric query', () => {
    expect(names(filterPokedex(entries, { query: '25' }))).toEqual(['pikachu', 'ho-oh']);
    expect(names(filterPokedex(entries, { query: '#0025' }))).toEqual(['pikachu', 'ho-oh']);
    expect(names(filterPokedex(entries, { query: '122' }))).toEqual(['mr-mime']);
  });

  it('combines the query with a set of allowed ids', () => {
    expect(names(filterPokedex(entries, { ids: [26, 250] }))).toEqual(['raichu', 'ho-oh']);
    expect(names(filterPokedex(entries, { ids: [25, 26], query: 'rai' }))).toEqual(['raichu']);
  });
});
