import { useQuery } from '@tanstack/react-query';
import { episodesQueryOptions } from '../api/queries';
import { getIdFromResourceUrl } from '../api/rickAndMortyApi';

/** Episodes referenced by a character (`character.episode` holds resource URLs). */
export function useEpisodes(episodeUrls: readonly string[] | undefined) {
  const ids = (episodeUrls ?? [])
    .map(getIdFromResourceUrl)
    .filter((id): id is number => id !== undefined);

  return useQuery(episodesQueryOptions(ids));
}
