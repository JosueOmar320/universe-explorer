import { describe, expect, it } from 'vitest';
import { parsePeopleFilters } from './filters';

const parse = (query: string) => parsePeopleFilters(new URLSearchParams(query));

describe('parsePeopleFilters', () => {
  it('reads the search and numeric ids', () => {
    expect(parse('q=%20sky%20&episode=4&species=1')).toEqual({
      q: 'sky',
      episode: '4',
      species: '1',
    });
  });

  it('drops malformed ids and blank searches', () => {
    expect(parse('q=%20&episode=IV&species=-2')).toEqual({
      q: undefined,
      episode: undefined,
      species: undefined,
    });
    expect(parse('episode=04').episode).toBeUndefined();
  });
});
