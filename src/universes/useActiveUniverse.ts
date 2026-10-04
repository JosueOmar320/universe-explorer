import { useLocation } from 'react-router';
import { findUniverseByPathname } from './registry';
import type { Universe } from './types';

/** The universe the user is currently browsing, or `undefined` while in the hub. */
export function useActiveUniverse(): Universe | undefined {
  const { pathname } = useLocation();
  return findUniverseByPathname(pathname);
}
