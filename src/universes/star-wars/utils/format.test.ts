import { describe, expect, it } from 'vitest';
import { formatCentimetres, formatEpisode, formatKilograms, formatRecordNumber } from './format';

describe('Star Wars formatting', () => {
  it('formats record numbers and episodes', () => {
    expect(formatRecordNumber(4)).toBe('0004');
    expect([1, 4, 6, 9].map(formatEpisode)).toEqual(['I', 'IV', 'VI', 'IX']);
  });

  it('formats units for the current language', () => {
    expect(formatCentimetres(172, 'en')).toBe('172 cm');
    expect(formatKilograms(1358, 'en')).toBe('1,358 kg');
    expect(formatKilograms(1358, 'es')).toBe('1358 kg');
  });
});
