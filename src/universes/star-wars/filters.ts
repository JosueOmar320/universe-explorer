export interface PeopleFilters {
  q?: string;
  /** Saga episode number (`4` = A New Hope). */
  episode?: string;
  /** SWAPI species id. */
  species?: string;
}

/** URL search params that hold people filters (`?q=sky&episode=4&species=1`). */
export const FILTER_KEYS = [
  'q',
  'episode',
  'species',
] as const satisfies readonly (keyof PeopleFilters)[];

const positiveInteger = (value: string | null) =>
  value && /^[1-9]\d*$/.test(value) ? value : undefined;

/**
 * Reads filters from the URL. Ids are only checked for shape here; ids that don't exist
 * in the API (e.g. `episode=42`) are ignored once the data is loaded.
 */
export function parsePeopleFilters(searchParams: URLSearchParams): PeopleFilters {
  return {
    q: searchParams.get('q')?.trim() || undefined,
    episode: positiveInteger(searchParams.get('episode')),
    species: positiveInteger(searchParams.get('species')),
  };
}
