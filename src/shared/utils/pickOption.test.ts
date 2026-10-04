import { describe, expect, it } from 'vitest';
import { pickOption } from './pickOption';

describe('pickOption', () => {
  const allowed = ['alive', 'dead'] as const;

  it('returns the value when it is allowed', () => {
    expect(pickOption('dead', allowed)).toBe('dead');
  });

  it('returns undefined for unknown, empty or missing values', () => {
    expect(pickOption('zombie', allowed)).toBeUndefined();
    expect(pickOption('', allowed)).toBeUndefined();
    expect(pickOption(null, allowed)).toBeUndefined();
  });
});
