import { queryOptions } from '@tanstack/react-query';
import { getCharacters } from './rickAndMortyApi';
import type { CharacterListParams } from './types';

/** Hierarchical query keys: invalidating `all` clears every character query. */
export const characterKeys = {
  all: ['rick-and-morty', 'characters'] as const,
  list: (params: CharacterListParams) => [...characterKeys.all, 'list', params] as const,
};

/** Shared by `useQuery` and `prefetchQuery` so both always use the same key and fetcher. */
export function charactersQueryOptions(params: CharacterListParams) {
  return queryOptions({
    queryKey: characterKeys.list(params),
    queryFn: ({ signal }) => getCharacters(params, signal),
  });
}
