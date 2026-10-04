/* Types mirroring https://rickandmortyapi.com/documentation */

export type CharacterStatus = 'Alive' | 'Dead' | 'unknown';

export type CharacterGender = 'Female' | 'Male' | 'Genderless' | 'unknown';

/** A reference to another resource (location/origin). `url` is empty when unknown. */
export interface ResourceRef {
  name: string;
  url: string;
}

export interface Character {
  id: number;
  name: string;
  status: CharacterStatus;
  species: string;
  /** Sub-species or variant; often an empty string. */
  type: string;
  gender: CharacterGender;
  origin: ResourceRef;
  location: ResourceRef;
  image: string;
  /** Episode resource URLs. */
  episode: string[];
  url: string;
  created: string;
}

export interface ApiPaginatedResponse<T> {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: T[];
}

/** Filter values accepted by `GET /character` (matching is case-insensitive). */
export type StatusFilter = 'alive' | 'dead' | 'unknown';

export type GenderFilter = 'female' | 'male' | 'genderless' | 'unknown';

/**
 * Filters supported by `GET /character`. Note that `name` and `species` are partial
 * matches on the API side (e.g. species "human" also returns "Humanoid").
 */
export interface CharacterFilters {
  name?: string;
  status?: StatusFilter;
  gender?: GenderFilter;
  species?: string;
}

export interface CharacterListParams extends CharacterFilters {
  page: number;
}

/** UI-friendly page of characters (we navigate by page number, not by `next` URLs). */
export interface CharacterPage {
  characters: Character[];
  totalCount: number;
  totalPages: number;
}
