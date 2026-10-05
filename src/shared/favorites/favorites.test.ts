import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  clearFavorites,
  type FavoriteInput,
  getFavorites,
  removeFavorite,
  subscribeToFavorites,
  toggleFavorite,
} from './favorites';

const STORAGE_KEY = 'universe-explorer:favorites';

const luke: FavoriteInput = {
  universe: 'star-wars',
  id: '1',
  name: 'Luke Skywalker',
  detail: '19BBY',
  href: '/star-wars/people/1',
};
const pikachu: FavoriteInput = {
  universe: 'pokemon',
  id: '25',
  name: 'Pikachu',
  href: '/pokemon/25',
};

describe('favorites', () => {
  afterEach(() => clearFavorites());

  it('toggles a record on and off, and keeps it in localStorage', () => {
    toggleFavorite(luke);

    expect(getFavorites()).toEqual([{ ...luke, savedAt: expect.any(Number) }]);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')).toHaveLength(1);

    toggleFavorite(luke);

    expect(getFavorites()).toEqual([]);
  });

  it('tells records of different universes apart, and removes one by universe and id', () => {
    toggleFavorite(luke);
    toggleFavorite(pikachu);
    // Same id, another universe: a different record.
    toggleFavorite({ ...pikachu, universe: 'rick-and-morty' });

    removeFavorite('pokemon', '25');

    expect(getFavorites().map(({ universe, id }) => `${universe}:${id}`)).toEqual([
      'star-wars:1',
      'rick-and-morty:25',
    ]);
  });

  it('returns the same snapshot until something changes (as useSyncExternalStore needs)', () => {
    toggleFavorite(luke);
    const snapshot = getFavorites();

    expect(getFavorites()).toBe(snapshot);
    toggleFavorite(pikachu);
    expect(getFavorites()).not.toBe(snapshot);
  });

  it('ignores stored data it does not understand instead of crashing', () => {
    localStorage.setItem(STORAGE_KEY, '{not json');
    expect(getFavorites()).toEqual([]);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([{ ...luke, savedAt: 1 }, { name: 'no id' }, 'nonsense']),
    );
    expect(getFavorites()).toEqual([{ ...luke, savedAt: 1 }]);
  });

  it('keeps working in memory when localStorage is unavailable', () => {
    clearFavorites();
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('SecurityError');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });

    toggleFavorite(luke);

    expect(getFavorites()).toEqual([{ ...luke, savedAt: expect.any(Number) }]);
  });

  it('notifies subscribers of changes made here and in other tabs', () => {
    const listener = vi.fn<() => void>();
    const unsubscribe = subscribeToFavorites(listener);

    toggleFavorite(luke);
    window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY }));
    window.dispatchEvent(new StorageEvent('storage', { key: 'something-else' }));

    expect(listener).toHaveBeenCalledTimes(2);
    unsubscribe();
    toggleFavorite(luke);
    expect(listener).toHaveBeenCalledTimes(2);
  });
});
