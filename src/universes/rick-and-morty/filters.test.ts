import { describe, expect, it } from 'vitest';
import { parseCharacterFilters } from './filters';

const parse = (query: string) => parseCharacterFilters(new URLSearchParams(query));

describe('parseCharacterFilters', () => {
  it('reads valid filters from the URL', () => {
    expect(parse('name=rick&status=dead&gender=male&species=alien')).toEqual({
      name: 'rick',
      status: 'dead',
      gender: 'male',
      species: 'alien',
    });
  });

  it('drops invalid values from hand-edited URLs', () => {
    expect(parse('status=zombie&gender=robot&species=dragon')).toEqual({
      name: undefined,
      status: undefined,
      gender: undefined,
      species: undefined,
    });
  });

  it('trims the name and ignores blank searches', () => {
    expect(parse('name=%20%20rick%20').name).toBe('rick');
    expect(parse('name=%20%20').name).toBeUndefined();
  });

  it('accepts multi-word species', () => {
    expect(parse('species=mythological+creature').species).toBe('mythological creature');
  });
});
