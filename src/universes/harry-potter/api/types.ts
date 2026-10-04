/* PotterDB responses follow JSON:API — https://docs.potterdb.com / https://jsonapi.org */

export interface JsonApiResource<TType extends string, TAttributes> {
  id: string;
  type: TType;
  attributes: TAttributes;
}

export interface JsonApiCollection<TResource> {
  data: TResource[];
  meta: {
    pagination: {
      current: number;
      next?: number;
      prev?: number;
      last?: number;
      records: number;
    };
  };
}

export interface JsonApiDocument<TResource> {
  data: TResource;
}

/** Character attributes (only the fields we use). Unknown values are `null`. */
export interface CharacterAttributes {
  slug: string;
  name: string;
  house: string | null;
  species: string | null;
  gender: string | null;
  blood_status: string | null;
  born: string | null;
  died: string | null;
  nationality: string | null;
  patronus: string | null;
  animagus: string | null;
  boggart: string | null;
  marital_status: string | null;
  eye_color: string | null;
  hair_color: string | null;
  height: string | null;
  weight: string | null;
  alias_names: string[];
  family_members: string[];
  jobs: string[];
  romances: string[];
  titles: string[];
  wands: string[];
}

export type CharacterResource = JsonApiResource<'character', CharacterAttributes>;
