import { getUniverse, getUniversePath } from '../registry';

const BASE_PATH = getUniversePath('harry-potter');

/** Display name from the registry, used in page titles. */
export const UNIVERSE_NAME = getUniverse('harry-potter').name;

export const harryPotterPaths = {
  characters: BASE_PATH,
  character: (slug: string) => `${BASE_PATH}/${encodeURIComponent(slug)}`,
};
