import type { FieldOption } from '@/shared/components/fieldOption';
import { pickOption } from '@/shared/utils/pickOption';
import type { CharacterFilters, GenderFilter, StatusFilter } from './api/types';

export const STATUS_OPTIONS: readonly FieldOption<StatusFilter>[] = [
  { value: 'alive', label: 'Alive' },
  { value: 'dead', label: 'Dead' },
  { value: 'unknown', label: 'Unknown' },
];

export const GENDER_OPTIONS: readonly FieldOption<GenderFilter>[] = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
  { value: 'genderless', label: 'Genderless' },
  { value: 'unknown', label: 'Unknown' },
];

/** Species present in the dataset. The API has no endpoint to list them, so they're curated. */
export const SPECIES_OPTIONS: readonly FieldOption[] = [
  { value: 'human', label: 'Human' },
  { value: 'alien', label: 'Alien' },
  { value: 'humanoid', label: 'Humanoid' },
  { value: 'robot', label: 'Robot' },
  { value: 'animal', label: 'Animal' },
  { value: 'mythological creature', label: 'Mythological Creature' },
  { value: 'cronenberg', label: 'Cronenberg' },
  { value: 'poopybutthole', label: 'Poopybutthole' },
  { value: 'disease', label: 'Disease' },
  { value: 'unknown', label: 'Unknown' },
];

/** URL search params that hold character filters. */
export const FILTER_KEYS = [
  'name',
  'status',
  'gender',
  'species',
] as const satisfies readonly (keyof CharacterFilters)[];

const values = <T extends string>(options: readonly FieldOption<T>[]) =>
  options.map((option) => option.value);

/** Reads filters from the URL, dropping anything invalid (hand-edited or stale links). */
export function parseCharacterFilters(searchParams: URLSearchParams): CharacterFilters {
  return {
    name: searchParams.get('name')?.trim() || undefined,
    status: pickOption(searchParams.get('status'), values(STATUS_OPTIONS)),
    gender: pickOption(searchParams.get('gender'), values(GENDER_OPTIONS)),
    species: pickOption(searchParams.get('species'), values(SPECIES_OPTIONS)),
  };
}
