import { type QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CharacterPage } from '../api/models';
import { characterKeys, characterQueryOptions } from '../api/queries';

/** Looks for a character inside any cached listing page. */
function findInCachedPages(queryClient: QueryClient, slug: string) {
  const pages = queryClient.getQueriesData<CharacterPage>({ queryKey: characterKeys.lists() });

  for (const [queryKey, page] of pages) {
    const character = page?.characters.find((candidate) => candidate.slug === slug);
    if (character) {
      return { character, updatedAt: queryClient.getQueryState(queryKey)?.dataUpdatedAt };
    }
  }
  return undefined;
}

/**
 * One character by slug. Arriving from the registry, the character is already in a cached
 * page (list items carry every attribute), so the page renders without waiting ~1 s.
 */
export function useCharacter(slug: string) {
  const queryClient = useQueryClient();

  return useQuery({
    ...characterQueryOptions(slug),
    initialData: () => findInCachedPages(queryClient, slug)?.character,
    initialDataUpdatedAt: () => findInCachedPages(queryClient, slug)?.updatedAt,
  });
}
