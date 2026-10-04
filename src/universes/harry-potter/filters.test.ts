import { describe, expect, it } from 'vitest';
import { HOGWARTS_HOUSES } from './api/models';
import { parseCharacterFilters, toListParams } from './filters';

const parse = (query: string) => parseCharacterFilters(new URLSearchParams(query));

describe('parseCharacterFilters', () => {
  it('reads the search and a valid house scope', () => {
    expect(parse('q=%20weasley%20&house=gryffindor')).toEqual({
      q: 'weasley',
      house: 'gryffindor',
    });
    expect(parse('house=everyone').house).toBe('everyone');
  });

  it('drops unknown houses and blank searches', () => {
    expect(parse('q=%20&house=durmstrang')).toEqual({ q: undefined, house: undefined });
  });
});

describe('toListParams', () => {
  it('defaults to Hogwarts students: any of the four houses', () => {
    expect(toListParams({}, 2)).toEqual({ page: 2, name: undefined, houses: HOGWARTS_HOUSES });
  });

  it('maps a house to the API name, and "everyone" to no house restriction', () => {
    expect(toListParams({ q: 'malfoy', house: 'slytherin' }, 1)).toEqual({
      page: 1,
      name: 'malfoy',
      house: 'Slytherin',
    });
    expect(toListParams({ house: 'everyone' }, 1)).toEqual({ page: 1, name: undefined });
  });
});
