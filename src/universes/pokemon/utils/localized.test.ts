import { describe, expect, it } from 'vitest';
import { normalizeGameText, pickLocalized } from './localized';

describe('pickLocalized', () => {
  const text = { en: 'Mouse Pokémon', es: 'Pokémon Ratón' };

  it('returns the text in the requested language', () => {
    expect(pickLocalized(text, 'es')).toBe('Pokémon Ratón');
  });

  it('falls back to English, then to an empty string', () => {
    expect(pickLocalized(text, 'fr')).toBe('Mouse Pokémon');
    expect(pickLocalized(text, undefined)).toBe('Mouse Pokémon');
    expect(pickLocalized({ ja: 'ねずみポケモン' }, 'es')).toBe('');
  });
});

describe('normalizeGameText', () => {
  it('turns hard line breaks, form feeds and soft hyphens into normal prose', () => {
    expect(normalizeGameText('It stores\nelectricity in\fits cheeks.')).toBe(
      'It stores electricity in its cheeks.',
    );
    expect(normalizeGameText('electri­\ncity  ')).toBe('electricity');
  });
});
