import { describe, expect, it } from 'vitest';
import { parseSwapiNumber, parseSwapiText } from './swapiValues';

describe('parseSwapiText', () => {
  it("turns SWAPI's placeholders into null", () => {
    expect(['unknown', 'n/a', 'none', 'NONE', '  '].map(parseSwapiText)).toEqual([
      null,
      null,
      null,
      null,
      null,
    ]);
  });

  it('keeps real values, trimmed', () => {
    expect(parseSwapiText(' blond ')).toBe('blond');
    expect(parseSwapiText('19BBY')).toBe('19BBY');
  });
});

describe('parseSwapiNumber', () => {
  it('parses numbers, including thousands separators', () => {
    expect(parseSwapiNumber('172')).toBe(172);
    expect(parseSwapiNumber('1,358')).toBe(1358);
    expect(parseSwapiNumber('41.9')).toBe(41.9);
  });

  it('returns null for placeholders and non-numbers', () => {
    expect(parseSwapiNumber('unknown')).toBeNull();
    expect(parseSwapiNumber('a lot')).toBeNull();
  });
});
