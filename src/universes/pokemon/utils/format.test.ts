import { describe, expect, it } from 'vitest';
import {
  formatDexNumber,
  formatHeight,
  formatPokemonName,
  formatWeight,
  toRomanNumeral,
} from './format';

describe('formatDexNumber', () => {
  it('pads National Pokédex numbers to four digits', () => {
    expect(formatDexNumber(25)).toBe('#0025');
    expect(formatDexNumber(1025)).toBe('#1025');
  });
});

describe('formatPokemonName', () => {
  it('turns API slugs into titles', () => {
    expect(formatPokemonName('pikachu')).toBe('Pikachu');
    expect(formatPokemonName('mr-mime')).toBe('Mr Mime');
  });
});

describe('toRomanNumeral', () => {
  it('numbers generations like the games do', () => {
    expect([1, 4, 5, 8, 9].map(toRomanNumeral)).toEqual(['I', 'IV', 'V', 'VIII', 'IX']);
  });
});

describe('formatHeight / formatWeight', () => {
  it('converts API units to metres and kilograms in the user language', () => {
    expect(formatHeight(4, 'en')).toBe('0.4 m');
    expect(formatWeight(60, 'en')).toBe('6 kg');
    expect(formatHeight(17, 'es')).toBe('1,7 m');
    expect(formatWeight(9050, 'es')).toBe('905 kg');
  });
});
