/* SWAPI response shapes (only the fields we use) — https://swapi.info / https://swapi.dev */

/**
 * SWAPI encodes every value as a string, with placeholders for missing data:
 * "unknown", "n/a" or "none".
 */
export type SwapiString = string;

export interface PersonDto {
  name: string;
  height: SwapiString;
  mass: SwapiString;
  hair_color: SwapiString;
  skin_color: SwapiString;
  eye_color: SwapiString;
  birth_year: SwapiString;
  gender: SwapiString;
  homeworld: string;
  films: string[];
  species: string[];
  vehicles: string[];
  starships: string[];
  url: string;
}

export interface PlanetDto {
  name: string;
  climate: SwapiString;
  terrain: SwapiString;
  population: SwapiString;
  url: string;
}

export interface SpeciesDto {
  name: string;
  classification: SwapiString;
  language: SwapiString;
  url: string;
}

export interface FilmDto {
  title: string;
  episode_id: number;
  director: string;
  release_date: string;
  url: string;
}
