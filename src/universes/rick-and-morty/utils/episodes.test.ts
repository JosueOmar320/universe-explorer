import { describe, expect, it } from 'vitest';
import { createEpisode } from '../test/fixtures';
import { groupEpisodesBySeason, parseEpisodeCode } from './episodes';

describe('parseEpisodeCode', () => {
  it('parses season and episode numbers', () => {
    expect(parseEpisodeCode('S03E07')).toEqual({ season: 3, episode: 7 });
  });

  it('returns undefined for malformed codes', () => {
    expect(parseEpisodeCode('Pilot')).toBeUndefined();
    expect(parseEpisodeCode('S1')).toBeUndefined();
  });
});

describe('groupEpisodesBySeason', () => {
  it('groups by season and sorts seasons and episodes', () => {
    const seasons = groupEpisodesBySeason([
      createEpisode({ id: 12, episode: 'S02E01' }),
      createEpisode({ id: 2, episode: 'S01E02' }),
      createEpisode({ id: 1, episode: 'S01E01' }),
    ]);

    expect(seasons.map((season) => season.number)).toEqual([1, 2]);
    expect(seasons[0]?.episodes.map((episode) => episode.id)).toEqual([1, 2]);
  });

  it('puts unparseable codes in season 0', () => {
    const [season] = groupEpisodesBySeason([createEpisode({ id: 99, episode: 'Special' })]);
    expect(season?.number).toBe(0);
  });

  it('does not mutate its input', () => {
    const input = [
      createEpisode({ id: 2, episode: 'S01E02' }),
      createEpisode({ id: 1, episode: 'S01E01' }),
    ];
    groupEpisodesBySeason(input);
    expect(input.map((episode) => episode.id)).toEqual([2, 1]);
  });
});
