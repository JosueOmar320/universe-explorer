import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { paginate } from '@/shared/utils/paginate';
import { filmsQueryOptions, peopleQueryOptions } from '../api/queries';
import type { PeopleFilters } from '../filters';
import { filterPeople } from '../utils/people';

export const PEOPLE_PAGE_SIZE = 12;

/**
 * One page of (optionally filtered) people. Everything runs in memory on cached
 * collections; the films collection is only needed to map an episode to its film.
 */
export function usePeopleResults({ page, q, episode, species }: PeopleFilters & { page: number }) {
  const peopleQuery = useQuery(peopleQueryOptions());
  const filmsQuery = useQuery(filmsQueryOptions());

  const people = peopleQuery.data;
  const films = filmsQuery.data;
  const isWaitingForFilms = episode !== undefined && films === undefined;

  const results = useMemo(() => {
    if (!people || isWaitingForFilms) return undefined;
    // Unknown episodes/species from hand-edited URLs are ignored rather than emptying the list.
    const filmId = films?.find((film) => String(film.episode) === episode)?.id;
    const speciesId = species === undefined ? undefined : Number(species);
    return paginate(filterPeople(people, { query: q, filmId, speciesId }), page, PEOPLE_PAGE_SIZE);
  }, [people, films, isWaitingForFilms, q, episode, species, page]);

  const failedQuery = peopleQuery.isError
    ? peopleQuery
    : isWaitingForFilms && filmsQuery.isError
      ? filmsQuery
      : undefined;

  return {
    results,
    totalPeople: people?.length,
    isPending: results === undefined && failedQuery === undefined,
    isPaused: peopleQuery.fetchStatus === 'paused' || filmsQuery.fetchStatus === 'paused',
    error: failedQuery?.error,
    isRetrying: failedQuery?.isFetching ?? false,
    retry: () => void failedQuery?.refetch(),
  };
}
