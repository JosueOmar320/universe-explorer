export type UniverseId = 'rick-and-morty' | 'pokemon' | 'star-wars' | 'marvel';

export type UniverseStatus = 'available' | 'coming-soon';

/**
 * Static metadata the shell needs to list a universe (selector, home page).
 * Universe-specific UI, data and styles live inside `src/universes/<id>/`.
 */
export interface Universe {
  id: UniverseId;
  name: string;
  tagline: string;
  status: UniverseStatus;
  /** Signature colour used by the shell to preview the universe before entering it. */
  accentColor: string;
}
