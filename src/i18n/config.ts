/**
 * Languages offered in the UI. Labels are written in their own language (endonyms), so
 * users can always find theirs. Adding a language = add an entry + its `src/locales/<code>/`.
 */
export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', shortLabel: 'EN' },
  { code: 'es', label: 'Español', shortLabel: 'ES' },
] as const;

export type Language = (typeof SUPPORTED_LANGUAGES)[number]['code'];

export const DEFAULT_LANGUAGE: Language = 'en';

export const LANGUAGE_STORAGE_KEY = 'universe-explorer:language';

const SUPPORTED_CODES: readonly string[] = SUPPORTED_LANGUAGES.map(({ code }) => code);

export function isSupportedLanguage(value: unknown): value is Language {
  return typeof value === 'string' && SUPPORTED_CODES.includes(value);
}

/**
 * Picks the initial language: an explicit previous choice wins, then the first supported
 * browser language (`es-MX` → `es`), then the default.
 */
export function detectLanguage(
  storedLanguage: string | null,
  browserLanguages: readonly string[],
): Language {
  if (isSupportedLanguage(storedLanguage)) return storedLanguage;

  for (const browserLanguage of browserLanguages) {
    const [base] = browserLanguage.toLowerCase().split('-');
    if (isSupportedLanguage(base)) return base;
  }
  return DEFAULT_LANGUAGE;
}
