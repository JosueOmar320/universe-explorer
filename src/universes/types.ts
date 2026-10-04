import type { QueryClient } from '@tanstack/react-query';
import type { NonIndexRouteObject } from 'react-router';

export type UniverseId = 'rick-and-morty' | 'pokemon' | 'star-wars' | 'harry-potter';

export type UniverseStatus = 'available' | 'coming-soon';

/**
 * Static metadata the shell needs to list a universe (selector, home page).
 * Universe-specific UI, data and styles live inside `src/universes/<id>/`.
 */
export interface Universe {
  id: UniverseId;
  /** Proper noun, not translated. Taglines live in the `common` translations. */
  name: string;
  status: UniverseStatus;
  /** Signature colour used by the shell to preview the universe before entering it. */
  accentColor: string;
}

/** A universe's route tree. Its path is derived from the universe id by the router. */
export type UniverseRoute = Omit<NonIndexRouteObject, 'path'>;

/** One record found by the global search. */
export interface SearchHit {
  id: string;
  name: string;
  /** Short context shown next to the name (species, house, Pokédex number…). */
  detail?: string;
  href: string;
}

export interface SearchResults {
  /** The first matches, in the universe's own order. */
  hits: SearchHit[];
  /** Every match, so the search can offer the full list. */
  total: number;
}

/** How a universe takes part in the global search (see src/universes/search.ts). */
export interface UniverseSearch {
  /** Searches records by name, reusing the universe's own queries and cache. */
  search: (query: string, client: QueryClient, limit: number) => Promise<SearchResults>;
  /** The universe's listing filtered by the same text. */
  listingHref: (query: string) => string;
}
