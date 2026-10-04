import enCommon from '@/locales/en/common.json';
import enRickAndMorty from '@/locales/en/rickAndMorty.json';
import esCommon from '@/locales/es/common.json';
import esRickAndMorty from '@/locales/es/rickAndMorty.json';
import type { Language } from './config';

/**
 * Namespaces: `common` for the shell and shared components, one per universe for its own UI.
 * English is the reference: every other language must provide the same keys (type-checked).
 */
const en = {
  common: enCommon,
  rickAndMorty: enRickAndMorty,
};

type Translations = typeof en;

export const resources = {
  en,
  es: { common: esCommon, rickAndMorty: esRickAndMorty } satisfies Translations,
} satisfies Record<Language, Translations>;

export const NAMESPACES = Object.keys(en) as (keyof Translations)[];
