import type { CSSProperties } from 'react';
import type { PokemonType } from '../api/models';

/** Exposes a type's theme colours (background + accessible text) as local CSS variables. */
export function typeColorVars(type: PokemonType): CSSProperties {
  return {
    '--type-color': `var(--pk-type-${type})`,
    '--type-text': `var(--pk-type-${type}-text)`,
  };
}
