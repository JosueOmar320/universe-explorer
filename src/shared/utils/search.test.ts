import { describe, expect, it } from 'vitest';
import { normalizeSearchText } from './search';

describe('normalizeSearchText', () => {
  it('ignores case, accents, spaces and punctuation', () => {
    expect(normalizeSearchText('Mr. Mime')).toBe('mrmime');
    expect(normalizeSearchText('Flabébé')).toBe('flabebe');
    expect(normalizeSearchText('R2-D2')).toBe('r2d2');
  });
});
