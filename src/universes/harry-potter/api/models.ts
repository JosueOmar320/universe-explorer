/* UI-facing models: camelCase, flattened JSON:API resources. */

export const HOGWARTS_HOUSES = ['Gryffindor', 'Hufflepuff', 'Ravenclaw', 'Slytherin'] as const;

export type HogwartsHouse = (typeof HOGWARTS_HOUSES)[number];

export interface Character {
  /** Stable PotterDB UUID. */
  id: string;
  /** URL-friendly identifier, also accepted by the API (`/characters/harry-potter`). */
  slug: string;
  name: string;
  /** Usually a Hogwarts house, but the API also has other values (e.g. Ilvermorny houses). */
  house: string | null;
  species: string | null;
  gender: string | null;
  bloodStatus: string | null;
  /** Free text, e.g. "31 July 1980, Godric's Hollow…". */
  born: string | null;
  died: string | null;
  nationality: string | null;
  patronus: string | null;
  animagus: string | null;
  boggart: string | null;
  maritalStatus: string | null;
  eyeColor: string | null;
  hairColor: string | null;
  skinColor: string | null;
  height: string | null;
  weight: string | null;
  aliases: string[];
  familyMembers: string[];
  jobs: string[];
  romances: string[];
  titles: string[];
  wands: string[];
}

export interface CharacterListParams {
  page: number;
  /** Matches any part of the name (server-side). */
  name?: string;
  house?: HogwartsHouse;
  /** Restrict to any of these houses (ignored when `house` is set). */
  houses?: readonly HogwartsHouse[];
}

export interface CharacterPage {
  characters: Character[];
  totalCount: number;
  totalPages: number;
}
