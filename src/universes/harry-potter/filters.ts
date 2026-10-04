import { pickOption } from '@/shared/utils/pickOption';
import { HOGWARTS_HOUSES, type CharacterListParams, type HogwartsHouse } from './api/models';

/** Scope options kept in the URL (lowercase): one house, or every record. */
export const HOUSE_FILTERS = [
  'gryffindor',
  'hufflepuff',
  'ravenclaw',
  'slytherin',
  'everyone',
] as const;

export type HouseFilter = (typeof HOUSE_FILTERS)[number];

export interface CharacterFilters {
  /** Name search, applied by the API. */
  q?: string;
  /** Without a value, the list shows Hogwarts students (any of the four houses). */
  house?: HouseFilter;
}

/** URL search params that hold registry filters (`?q=weasley&house=gryffindor`). */
export const FILTER_KEYS = ['q', 'house'] as const satisfies readonly (keyof CharacterFilters)[];

export function parseCharacterFilters(searchParams: URLSearchParams): CharacterFilters {
  return {
    q: searchParams.get('q')?.trim() || undefined,
    house: pickOption(searchParams.get('house'), HOUSE_FILTERS),
  };
}

function toHogwartsHouse(filter: HouseFilter): HogwartsHouse | undefined {
  return HOGWARTS_HOUSES.find((house) => house.toLowerCase() === filter);
}

/** Translates URL filters into API params (the API's house names are capitalized). */
export function toListParams({ q, house }: CharacterFilters, page: number): CharacterListParams {
  if (house === 'everyone') return { page, name: q };
  if (house) return { page, name: q, house: toHogwartsHouse(house) };
  return { page, name: q, houses: HOGWARTS_HOUSES };
}
