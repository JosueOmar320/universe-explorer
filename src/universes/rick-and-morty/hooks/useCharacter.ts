import { type QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import { characterKeys, characterQueryOptions } from '../api/queries';
import type { CharacterPage } from '../api/types';

/** Looks for a character inside any cached listing page. */
function findInCachedPages(queryClient: QueryClient, id: number) {
  const pages = queryClient.getQueriesData<CharacterPage>({ queryKey: characterKeys.lists() });

  for (const [queryKey, page] of pages) {
    const character = page?.characters.find((candidate) => candidate.id === id);
    if (character) {
      return { character, updatedAt: queryClient.getQueryState(queryKey)?.dataUpdatedAt };
    }
  }
  return undefined;
}

/**
 * Single character. When the user arrives from the listing, the character is already in
 * a cached page, so the query is seeded with it and the profile renders instantly.
 */
export function useCharacter(id: number) {
  const queryClient = useQueryClient();

  return useQuery({
    ...characterQueryOptions(id),
    initialData: () => findInCachedPages(queryClient, id)?.character,
    // The seeded data is as fresh as the page it came from, so normal staleness rules apply.
    initialDataUpdatedAt: () => findInCachedPages(queryClient, id)?.updatedAt,
  });
}
