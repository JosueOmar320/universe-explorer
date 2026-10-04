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

/** Query parameters supported by `GET /character`. */
export interface CharacterListParams {
  page: number;
  name?: string;
  status?: CharacterStatus;
  species?: string;
  gender?: CharacterGender;
}

/** UI-friendly page of characters (we navigate by page number, not by `next` URLs). */
export interface CharacterPage {
  characters: Character[];
  totalCount: number;
  totalPages: number;
}
