/* UI-facing models: typed values instead of SWAPI's strings, and ids instead of URLs. */

export interface Person {
  id: number;
  name: string;
  /** Centimetres; `null` when unknown. */
  heightCm: number | null;
  /** Kilograms; `null` when unknown. */
  massKg: number | null;
  /** In-universe calendar, e.g. "19BBY" (19 years Before the Battle of Yavin). */
  birthYear: string | null;
  gender: string | null;
  hairColor: string | null;
  skinColor: string | null;
  eyeColor: string | null;
  homeworldId: number | null;
  /** Empty for humans: SWAPI leaves `species` empty when it is "Human". */
  speciesIds: number[];
  filmIds: number[];
  starshipIds: number[];
  vehicleIds: number[];
}

export interface Planet {
  id: number;
  name: string;
  climate: string | null;
  terrain: string | null;
  population: number | null;
}

export interface Species {
  id: number;
  name: string;
  classification: string | null;
  language: string | null;
}

export interface Film {
  id: number;
  title: string;
  episode: number;
  director: string;
  releaseDate: string;
}

/** Starship or vehicle. */
export interface Craft {
  id: number;
  name: string;
  model: string;
  /** e.g. "Starfighter", "wheeled". */
  craftClass: string | null;
}
