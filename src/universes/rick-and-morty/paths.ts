import { getUniverse, getUniversePath } from '../registry';

const BASE_PATH = getUniversePath('rick-and-morty');

/** Display name from the registry, used in page titles. */
export const UNIVERSE_NAME = getUniverse('rick-and-morty').name;

export const rickAndMortyPaths = {
  characters: BASE_PATH,
  character: (id: number) => `${BASE_PATH}/characters/${id}`,
};

/** Router state set when a character is opened from the listing. */
interface FromListState {
  fromList: true;
}

export const FROM_LIST_STATE: FromListState = { fromList: true };

export function isFromListState(state: unknown): state is FromListState {
  return (
    typeof state === 'object' && state !== null && 'fromList' in state && state.fromList === true
  );
}
