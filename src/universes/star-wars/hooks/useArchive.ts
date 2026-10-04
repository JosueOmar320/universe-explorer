import { useQuery } from '@tanstack/react-query';
import { filmsQueryOptions, planetsQueryOptions, speciesQueryOptions } from '../api/queries';

/** Module-level so TanStack Query can memoize the `select` result. */
function byId<T extends { id: number }>(items: T[]): Map<number, T> {
  return new Map(items.map((item) => [item.id, item]));
}

/**
 * Reference data used to resolve the ids found on people (planets, species, films).
 * One request per collection, cached for the session and shared by every component.
 */
export function useArchive() {
  const planets = useQuery({ ...planetsQueryOptions(), select: byId });
  const species = useQuery({ ...speciesQueryOptions(), select: byId });
  const films = useQuery(filmsQueryOptions());

  return {
    planetsById: planets.data,
    speciesById: species.data,
    /** In episode order. */
    films: films.data,
  };
}
