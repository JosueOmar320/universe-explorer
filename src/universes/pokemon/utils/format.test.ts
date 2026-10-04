import { describe, expect, it } from 'vitest';
import { formatDexNumber, formatPokemonName } from './format';

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
