import type { LocalizedText } from '../api/models';

const FALLBACK_LANGUAGE = 'en';

/**
 * Text in the requested language, falling back to English. PokéAPI ships official
 * translations, so we show the API's own localized data instead of translating it.
 */
export function pickLocalized(text: LocalizedText, language: string | undefined): string {
  return (language && text[language]) || text[FALLBACK_LANGUAGE] || '';
}

/**
 * Game text contains hard line breaks, form feeds and soft hyphens meant for small
 * screens; turn them into normal prose.
 */
export function normalizeGameText(text: string): string {
  return text
    .replace(/­\s*/g, '')
    .replace(/[\f\n\r]+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}
