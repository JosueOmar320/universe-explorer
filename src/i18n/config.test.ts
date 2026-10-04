import { describe, expect, it } from 'vitest';
import { detectLanguage } from './config';

describe('detectLanguage', () => {
  it('prefers the language the user chose before', () => {
    expect(detectLanguage('es', ['en-US'])).toBe('es');
  });

  it('ignores a stored value that is no longer supported', () => {
    expect(detectLanguage('fr', ['es-ES'])).toBe('es');
  });

  it('uses the first supported browser language, matching regional variants', () => {
    expect(detectLanguage(null, ['fr-FR', 'es-MX', 'en-US'])).toBe('es');
    expect(detectLanguage(null, ['EN-gb'])).toBe('en');
  });

  it('falls back to English', () => {
    expect(detectLanguage(null, ['de-DE', 'ja'])).toBe('en');
    expect(detectLanguage(null, [])).toBe('en');
  });
});
