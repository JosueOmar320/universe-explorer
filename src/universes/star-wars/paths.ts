import { getUniverse, getUniversePath } from '../registry';

const BASE_PATH = getUniversePath('star-wars');

/** Display name from the registry, used in page titles. */
export const UNIVERSE_NAME = getUniverse('star-wars').name;

export const starWarsPaths = {
  people: BASE_PATH,
  person: (id: number) => `${BASE_PATH}/people/${id}`,
};
