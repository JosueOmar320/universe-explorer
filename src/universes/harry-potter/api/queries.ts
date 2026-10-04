import { queryOptions } from '@tanstack/react-query';
import type { CharacterListParams } from './models';
import { getCharacter, getCharacters } from './potterDb';

/**
 * PotterDB sends no cache headers and answers in ~1 s, so client-side caching does the
 * heavy lifting. The data is static: cached results stay fresh for the session.
 */
const STATIC_DATA = { staleTime: Infinity, gcTime: 60 * 60 * 1000 } as const;

export const characterKeys = {
  all: ['harry-potter', 'characters'] as const,
  lists: () => [...characterKeys.all, 'list'] as const,
  list: (params: CharacterListParams) => [...characterKeys.lists(), params] as const,
  detail: (slug: string) => [...characterKeys.all, 'detail', slug] as const,
};

export function charactersQueryOptions(params: CharacterListParams) {
  return queryOptions({
    queryKey: characterKeys.list(params),
    queryFn: ({ signal }) => getCharacters(params, signal),
    ...STATIC_DATA,
  });
}

export function characterQueryOptions(slug: string) {
  return queryOptions({
    queryKey: characterKeys.detail(slug),
    queryFn: ({ signal }) => getCharacter(slug, signal),
    ...STATIC_DATA,
  });
}
