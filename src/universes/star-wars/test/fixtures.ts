import { apiConfig } from '@/config/apis';
import type {
  FilmDto,
  PersonDto,
  PlanetDto,
  SpeciesDto,
  StarshipDto,
  VehicleDto,
} from '../api/types';

const API = apiConfig.starWars.baseUrl;
const url = (resource: string, id: number) => `${API}/${resource}/${id}`;

export function createPersonDto(
  id: number,
  name: string,
  overrides: Partial<PersonDto> = {},
): PersonDto {
  return {
    name,
    height: '172',
    mass: '77',
    hair_color: 'blond',
    skin_color: 'fair',
    eye_color: 'blue',
    birth_year: '19BBY',
    gender: 'male',
    homeworld: url('planets', 1),
    films: [url('films', 1)],
    species: [],
    vehicles: [],
    starships: [],
    url: url('people', id),
    ...overrides,
  };
}

/** Out of order on purpose: the service sorts by id. Includes SWAPI's odd values. */
export const peopleDtos: PersonDto[] = [
  createPersonDto(2, 'C-3PO', {
    height: '167',
    mass: '75',
    gender: 'n/a',
    birth_year: '112BBY',
    species: [url('species', 2)],
  }),
  createPersonDto(1, 'Luke Skywalker', {
    films: [url('films', 1), url('films', 2)],
    starships: [url('starships', 12)],
    vehicles: [url('vehicles', 14)],
  }),
  createPersonDto(16, 'Jabba Desilijic Tiure', {
    height: '175',
    mass: '1,358',
    hair_color: 'n/a',
    birth_year: '600BBY',
    gender: 'hermaphrodite',
    homeworld: url('planets', 24),
    species: [url('species', 5)],
  }),
  createPersonDto(4, 'Darth Vader', { height: '202', mass: 'unknown', hair_color: 'none' }),
  // Filler records so the listing has more than one page (12 per page).
  ...Array.from({ length: 10 }, (_, index) =>
    createPersonDto(30 + index, `Archive Record ${index + 1}`, { birth_year: 'unknown' }),
  ),
];

export const planetDtos: PlanetDto[] = [
  { name: 'Tatooine', climate: 'arid', terrain: 'desert', population: '200000', url: url('planets', 1) },
  { name: 'Nal Hutta', climate: 'temperate', terrain: 'urban, oceans, swamps, bogs', population: '7000000000', url: url('planets', 24) },
  { name: 'Unknown Regions', climate: 'unknown', terrain: 'unknown', population: 'unknown', url: url('planets', 28) },
]; // prettier-ignore

export const speciesDtos: SpeciesDto[] = [
  { name: 'Human', classification: 'mammal', language: 'Galactic Basic', url: url('species', 1) },
  { name: 'Droid', classification: 'artificial', language: 'n/a', url: url('species', 2) },
  { name: 'Hutt', classification: 'gastropod', language: 'Huttese', url: url('species', 5) },
]; // prettier-ignore

export const filmDtos: FilmDto[] = [
  { title: 'The Empire Strikes Back', episode_id: 5, director: 'Irvin Kershner', release_date: '1980-05-17', url: url('films', 2) },
  { title: 'A New Hope', episode_id: 4, director: 'George Lucas', release_date: '1977-05-25', url: url('films', 1) },
]; // prettier-ignore

export const starshipDtos: StarshipDto[] = [
  { name: 'X-wing', model: 'T-65 X-wing', starship_class: 'Starfighter', url: url('starships', 12) },
]; // prettier-ignore

export const vehicleDtos: VehicleDto[] = [
  { name: 'Snowspeeder', model: 't-47 airspeeder', vehicle_class: 'airspeeder', url: url('vehicles', 14) },
]; // prettier-ignore
