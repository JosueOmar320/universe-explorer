import { useQuery } from '@tanstack/react-query';
import { getIdFromResourceUrl } from '@/shared/api/resourceUrl';
import { episodesQueryOptions } from '../api/queries';

/** Episodes referenced by a character (`character.episode` holds resource URLs). */
export function useEpisodes(episodeUrls: readonly string[] | undefined) {
  const ids = (episodeUrls ?? [])
    .map(getIdFromResourceUrl)
    .filter((id): id is number => id !== undefined);

  return useQuery(episodesQueryOptions(ids));
}
