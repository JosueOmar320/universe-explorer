import { getUniverse, getUniversePath } from '../registry';

const BASE_PATH = getUniversePath('pokemon');

/** Display name from the registry, used in page titles. */
export const UNIVERSE_NAME = getUniverse('pokemon').name;

export const pokemonPaths = {
  pokedex: BASE_PATH,
  pokemon: (id: number) => `${BASE_PATH}/${id}`,
};
