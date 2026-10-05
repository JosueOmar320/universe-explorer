import { useSyncExternalStore } from 'react';

/**
 * Favorites: records saved from any universe, kept in this browser (localStorage) and shared
 * across tabs. Each one is a snapshot (name, link…) so the favorites page renders without
 * calling any API. Universe-agnostic: `universe` is just the id the universe passes in.
 */
export interface Favorite {
  universe: string;
  id: string;
  name: string;
  /** Short context shown next to the name (species, house, Pokédex number…). */
  detail?: string;
  href: string;
  savedAt: number;
}

export type FavoriteInput = Omit<Favorite, 'savedAt'>;

const STORAGE_KEY = 'universe-explorer:favorites';
const listeners = new Set<() => void>();

// Used when localStorage is unavailable (private mode, blocked storage, full quota).
let memoryRaw: string | null = null;

function readRaw(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return memoryRaw;
  }
}

function isFavorite(value: unknown): value is Favorite {
  if (typeof value !== 'object' || value === null) return false;
  const { universe, id, name, href, savedAt, detail } = value as Record<string, unknown>;
  return (
    typeof universe === 'string' &&
    typeof id === 'string' &&
    typeof name === 'string' &&
    typeof href === 'string' &&
    typeof savedAt === 'number' &&
    (detail === undefined || typeof detail === 'string')
  );
}

function parse(raw: string | null): readonly Favorite[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    // Anything else (an older format, a hand-edited value) is ignored rather than crashing.
    return Array.isArray(parsed) ? parsed.filter(isFavorite) : [];
  } catch {
    return [];
  }
}

// The snapshot only changes when the stored text does, as useSyncExternalStore requires.
let snapshotRaw: string | null | undefined;
let snapshot: readonly Favorite[] = [];

export function getFavorites(): readonly Favorite[] {
  const raw = readRaw();
  if (raw !== snapshotRaw) {
    snapshotRaw = raw;
    snapshot = parse(raw);
  }
  return snapshot;
}

function save(favorites: readonly Favorite[]): void {
  const raw = JSON.stringify(favorites);
  memoryRaw = raw;
  try {
    localStorage.setItem(STORAGE_KEY, raw);
  } catch {
    // Kept in memory for this tab only.
  }
  for (const listener of listeners) listener();
}

const matches = (universe: string, id: string) => (favorite: Favorite) =>
  favorite.universe === universe && favorite.id === id;

export function toggleFavorite(input: FavoriteInput): void {
  const favorites = getFavorites();
  const isSaved = favorites.some(matches(input.universe, input.id));
  save(
    isSaved
      ? favorites.filter((favorite) => !matches(input.universe, input.id)(favorite))
      : [...favorites, { ...input, savedAt: Date.now() }],
  );
}

export function removeFavorite(universe: string, id: string): void {
  save(getFavorites().filter((favorite) => !matches(universe, id)(favorite)));
}

export function clearFavorites(): void {
  save([]);
}

export function subscribeToFavorites(listener: () => void): () => void {
  listeners.add(listener);
  // Another tab changed them.
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) listener();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

const noFavorites: readonly Favorite[] = [];

export function useFavorites(): readonly Favorite[] {
  return useSyncExternalStore(subscribeToFavorites, getFavorites, () => noFavorites);
}

export function useIsFavorite(universe: string, id: string): boolean {
  return useSyncExternalStore(
    subscribeToFavorites,
    () => getFavorites().some(matches(universe, id)),
    () => false,
  );
}
