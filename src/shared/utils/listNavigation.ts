/** Router state set by list items, so detail pages know the user came from that list. */
interface FromListState {
  fromList: true;
}

export const FROM_LIST_STATE: FromListState = { fromList: true };

export function isFromListState(state: unknown): state is FromListState {
  return (
    typeof state === 'object' && state !== null && 'fromList' in state && state.fromList === true
  );
}
