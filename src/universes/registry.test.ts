import { describe, expect, it } from 'vitest';
import { findUniverseByPathname } from './registry';

describe('findUniverseByPathname', () => {
  it('finds the available universe owning a path, including nested routes', () => {
    expect(findUniverseByPathname('/rick-and-morty')?.id).toBe('rick-and-morty');
    expect(findUniverseByPathname('/pokemon')?.id).toBe('pokemon');
    expect(findUniverseByPathname('/star-wars')?.id).toBe('star-wars');
    expect(findUniverseByPathname('/harry-potter')?.id).toBe('harry-potter');
    expect(findUniverseByPathname('/rick-and-morty/characters/1')?.id).toBe('rick-and-morty');
  });

  it('ignores the hub and unknown paths', () => {
    expect(findUniverseByPathname('/')).toBeUndefined();
    expect(findUniverseByPathname('/does-not-exist')).toBeUndefined();
  });
});
