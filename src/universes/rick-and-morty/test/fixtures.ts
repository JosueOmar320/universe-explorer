import { apiConfig } from '@/config/apis';
import type { Character, Episode } from '../api/types';

const API = apiConfig.rickAndMorty.baseUrl;

export function createCharacter(
  overrides: Partial<Character> & Pick<Character, 'id' | 'name'>,
): Character {
  return {
    status: 'Alive',
    species: 'Human',
    type: '',
    gender: 'Male',
    origin: { name: 'Earth (C-137)', url: `${API}/location/1` },
    location: { name: 'Citadel of Ricks', url: `${API}/location/3` },
    image: `${API}/character/avatar/${overrides.id}.jpeg`,
    episode: [`${API}/episode/1`],
    url: `${API}/character/${overrides.id}`,
    created: '2017-11-04T18:48:46.250Z',
    ...overrides,
  };
}

export function createEpisode(
  overrides: Partial<Episode> & Pick<Episode, 'id' | 'episode'>,
): Episode {
  return {
    name: `Episode ${overrides.id}`,
    air_date: 'December 2, 2013',
    characters: [],
    url: `${API}/episode/${overrides.id}`,
    created: '2017-11-10T12:56:33.798Z',
    ...overrides,
  };
}

export const episodes: Episode[] = [
  createEpisode({ id: 1, episode: 'S01E01', name: 'Pilot' }),
  createEpisode({ id: 2, episode: 'S01E02', name: 'Lawnmower Dog' }),
  createEpisode({ id: 12, episode: 'S02E01', name: 'A Rickle in Time' }),
];

/** 45 characters → 3 pages of 20, like the real API's page size. */
export const characters: Character[] = [
  createCharacter({
    id: 1,
    name: 'Rick Sanchez',
    episode: episodes.map((episode) => episode.url),
  }),
  createCharacter({ id: 2, name: 'Morty Smith' }),
  createCharacter({ id: 3, name: 'Summer Smith', gender: 'Female' }),
  createCharacter({
    id: 47,
    name: 'Birdperson',
    species: 'Alien',
    type: 'Bird-Person',
    status: 'Dead',
  }),
  ...Array.from({ length: 41 }, (_, index) =>
    createCharacter({ id: 100 + index, name: `Clone ${index + 1}`, status: 'unknown' }),
  ),
];
