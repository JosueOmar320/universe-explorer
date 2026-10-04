import type { Episode } from '../api/types';

export interface Season {
  /** `0` groups episodes whose code couldn't be parsed. */
  number: number;
  episodes: Episode[];
}

/** Parses codes like "S03E07". */
export function parseEpisodeCode(code: string): { season: number; episode: number } | undefined {
  const match = /^S(\d+)E(\d+)$/i.exec(code);
  if (!match?.[1] || !match[2]) return undefined;
  return { season: Number(match[1]), episode: Number(match[2]) };
}

export function groupEpisodesBySeason(episodes: readonly Episode[]): Season[] {
  const seasons = new Map<number, Episode[]>();

  for (const episode of [...episodes].sort((a, b) => a.id - b.id)) {
    const season = parseEpisodeCode(episode.episode)?.season ?? 0;
    seasons.set(season, [...(seasons.get(season) ?? []), episode]);
  }

  return [...seasons.entries()]
    .sort(([a], [b]) => a - b)
    .map(([number, seasonEpisodes]) => ({ number, episodes: seasonEpisodes }));
}
