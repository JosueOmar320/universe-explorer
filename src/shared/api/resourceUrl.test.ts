import { describe, expect, it } from 'vitest';
import { getIdFromResourceUrl } from './resourceUrl';

describe('getIdFromResourceUrl', () => {
  it('extracts the trailing numeric id, with or without a trailing slash', () => {
    expect(getIdFromResourceUrl('https://rickandmortyapi.com/api/episode/28')).toBe(28);
    expect(getIdFromResourceUrl('https://pokeapi.co/api/v2/pokemon-species/25/')).toBe(25);
  });

  it('returns undefined when there is no valid id', () => {
    expect(getIdFromResourceUrl('')).toBeUndefined();
    expect(getIdFromResourceUrl('https://pokeapi.co/api/v2/type/fire/')).toBeUndefined();
    expect(getIdFromResourceUrl('https://example.test/item/0')).toBeUndefined();
  });
});
