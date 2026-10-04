import { queryOptions } from '@tanstack/react-query';
import { getCharacter, getCharacters, getEpisodes } from './rickAndMortyApi';
import type { CharacterListParams } from './types';

/** Hierarchical query keys: invalidating `all` clears every character query. */
export const characterKeys = {
  all: ['rick-and-morty', 'characters'] as const,
  lists: () => [...characterKeys.all, 'list'] as const,
  list: (params: CharacterListParams) => [...characterKeys.lists(), params] as const,
  detail: (id: number) => [...characterKeys.all, 'detail', id] as const,
};

export const episodeKeys = {
  all: ['rick-and-morty', 'episodes'] as const,
  byIds: (ids: readonly number[]) => [...episodeKeys.all, 'by-ids', ids] as const,
};

/** Shared by `useQuery` and `prefetchQuery` so both always use the same key and fetcher. */
export function charactersQueryOptions(params: CharacterListParams) {
  return queryOptions({
    queryKey: characterKeys.list(params),
    queryFn: ({ signal }) => getCharacters(params, signal),
  });
}

export function characterQueryOptions(id: number) {
  return queryOptions({
    queryKey: characterKeys.detail(id),
    queryFn: ({ signal }) => getCharacter(id, signal),
  });
}

export function episodesQueryOptions(ids: readonly number[]) {
  return queryOptions({
    queryKey: episodeKeys.byIds(ids),
    queryFn: ({ signal }) => getEpisodes(ids, signal),
    enabled: ids.length > 0,
  });
}
