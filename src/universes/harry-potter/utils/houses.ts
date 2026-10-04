import type { CSSProperties } from 'react';
import { HOGWARTS_HOUSES, type HogwartsHouse } from '../api/models';

export function isHogwartsHouse(value: string | null): value is HogwartsHouse {
  return HOGWARTS_HOUSES.some((house) => house === value);
}

/** Exposes a house's colours (background + paired text) as local CSS variables. */
export function houseColorVars(house: string | null): CSSProperties {
  const token = isHogwartsHouse(house) ? house.toLowerCase() : 'no-house';
  return {
    '--house-color': `var(--hp-${token})`,
    '--house-text': `var(--hp-${token}-text)`,
  };
}
