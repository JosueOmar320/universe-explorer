import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';
import {
  DEFAULT_LANGUAGE,
  detectLanguage,
  type Language,
  LANGUAGE_STORAGE_KEY,
  SUPPORTED_LANGUAGES,
} from './config';
import { NAMESPACES, resources } from './resources';

// Storage can throw (privacy modes, blocked cookies); the language then just isn't remembered.
function readStoredLanguage(): string | null {
  try {
    return localStorage.getItem(LANGUAGE_STORAGE_KEY);
  } catch {
    return null;
  }
}

function storeLanguage(language: Language): void {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {
    // Ignore: persistence is a convenience, not a requirement.
  }
}

/** App-owned instance (provided through `I18nextProvider`) instead of the global singleton. */
const i18n = createInstance();

void i18n.use(initReactI18next).init({
  resources,
  lng: detectLanguage(readStoredLanguage(), navigator.languages ?? [navigator.language]),
  fallbackLng: DEFAULT_LANGUAGE,
  supportedLngs: SUPPORTED_LANGUAGES.map(({ code }) => code),
  ns: NAMESPACES,
  defaultNS: 'common',
  // Translations are bundled, so initialise synchronously: no flash of untranslated UI.
  initAsync: false,
  // React already escapes rendered strings.
  interpolation: { escapeValue: false },
});

/** Keeps `<html lang>` in sync so screen readers, hyphenation and spellcheck use the right language. */
function syncDocumentLanguage(language: string) {
  document.documentElement.lang = language;
}

syncDocumentLanguage(i18n.resolvedLanguage ?? DEFAULT_LANGUAGE);
i18n.on('languageChanged', syncDocumentLanguage);

/** Switches language and remembers the choice. Only explicit choices are persisted. */
export async function changeLanguage(language: Language): Promise<void> {
  storeLanguage(language);
  await i18n.changeLanguage(language);
}

export { i18n };
