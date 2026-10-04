import { useQuery } from '@tanstack/react-query';
import { starshipsQueryOptions, vehiclesQueryOptions } from '../api/queries';

function byId<T extends { id: number }>(items: T[]): Map<number, T> {
  return new Map(items.map((item) => [item.id, item]));
}

/** Starships and vehicles, only needed on the detail page (one cached request each). */
export function useCraft() {
  const starships = useQuery({ ...starshipsQueryOptions(), select: byId });
  const vehicles = useQuery({ ...vehiclesQueryOptions(), select: byId });
  return { starshipsById: starships.data, vehiclesById: vehicles.data };
}
