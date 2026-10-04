import enCommon from '@/locales/en/common.json';
import enHarryPotter from '@/locales/en/harryPotter.json';
import enPokemon from '@/locales/en/pokemon.json';
import enRickAndMorty from '@/locales/en/rickAndMorty.json';
import enStarWars from '@/locales/en/starWars.json';
import esCommon from '@/locales/es/common.json';
import esHarryPotter from '@/locales/es/harryPotter.json';
import esPokemon from '@/locales/es/pokemon.json';
import esRickAndMorty from '@/locales/es/rickAndMorty.json';
import esStarWars from '@/locales/es/starWars.json';
import type { Language } from './config';

/**
 * Namespaces: `common` for the shell and shared components, one per universe for its own UI.
 * English is the reference: every other language must provide the same keys (type-checked).
 */
const en = {
  common: enCommon,
  rickAndMorty: enRickAndMorty,
  pokemon: enPokemon,
  starWars: enStarWars,
  harryPotter: enHarryPotter,
};

type Translations = typeof en;

export const resources = {
  en,
  es: {
    common: esCommon,
    rickAndMorty: esRickAndMorty,
    pokemon: esPokemon,
    starWars: esStarWars,
    harryPotter: esHarryPotter,
  } satisfies Translations,
} satisfies Record<Language, Translations>;

export const NAMESPACES = Object.keys(en) as (keyof Translations)[];
