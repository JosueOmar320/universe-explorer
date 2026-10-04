import { fileURLToPath, URL } from 'node:url';
import { describe, expect, it } from 'vitest';
import { findUniverseRoutes } from './spaEntryPoints.ts';

describe('findUniverseRoutes', () => {
  it('finds every universe folder that registers routes', async () => {
    const universesDir = fileURLToPath(new URL('../src/universes', import.meta.url));

    expect(await findUniverseRoutes(universesDir)).toEqual([
      'harry-potter',
      'pokemon',
      'rick-and-morty',
      'star-wars',
    ]);
  });
});
