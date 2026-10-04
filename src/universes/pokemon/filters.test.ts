import { describe, expect, it } from 'vitest';
import { parsePokemonFilters } from './filters';

const parse = (query: string) => parsePokemonFilters(new URLSearchParams(query));

describe('parsePokemonFilters', () => {
  it('reads the search text and a valid type', () => {
    expect(parse('q=%20pika%20&type=electric')).toEqual({ q: 'pika', type: 'electric' });
  });

  it('drops unknown types and blank searches', () => {
    expect(parse('q=%20&type=stellar')).toEqual({ q: undefined, type: undefined });
  });
});
