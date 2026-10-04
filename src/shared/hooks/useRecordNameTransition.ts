import type { CSSProperties } from 'react';
import { useViewTransitionState } from 'react-router';

/**
 * List → detail navigations morph the record's name on its card into the detail page's heading
 * (View Transitions API; browsers without it simply navigate). A transition name must be unique
 * on the page, so a card only carries it while the navigation to its own page is running.
 */
const RECORD_NAME = 'record-name';

/** For the detail page heading: always the destination of the morph. */
export const recordNameTransition: CSSProperties = { viewTransitionName: RECORD_NAME };

/** For a list card's name, linking to `to`. */
export function useRecordNameTransition(to: string): CSSProperties | undefined {
  return useViewTransitionState(to) ? recordNameTransition : undefined;
}
