import { getUniverse, getUniversePath } from '../registry';

const BASE_PATH = getUniversePath('rick-and-morty');

/** Display name from the registry, used in page titles. */
export const UNIVERSE_NAME = getUniverse('rick-and-morty').name;

export const rickAndMortyPaths = {
  characters: BASE_PATH,
  character: (id: number) => `${BASE_PATH}/characters/${id}`,
};
