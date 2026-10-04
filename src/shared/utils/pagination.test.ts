import { describe, expect, it } from 'vitest';
import { getPaginationRange } from './pagination';

describe('getPaginationRange', () => {
  it('lists every page when they all fit', () => {
    expect(getPaginationRange(1, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(getPaginationRange(4, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('shows an ellipsis only at the end near the first page', () => {
    expect(getPaginationRange(1, 42)).toEqual([1, 2, 3, 4, 5, 'ellipsis-end', 42]);
    expect(getPaginationRange(3, 42)).toEqual([1, 2, 3, 4, 5, 'ellipsis-end', 42]);
  });

  it('shows both ellipses in the middle', () => {
    expect(getPaginationRange(6, 42)).toEqual([1, 'ellipsis-start', 5, 6, 7, 'ellipsis-end', 42]);
  });

  it('shows an ellipsis only at the start near the last page', () => {
    expect(getPaginationRange(42, 42)).toEqual([1, 'ellipsis-start', 38, 39, 40, 41, 42]);
  });

  it('keeps a constant number of items so the control never changes width', () => {
    const lengths = new Set(
      Array.from({ length: 42 }, (_, index) => getPaginationRange(index + 1, 42).length),
    );
    expect([...lengths]).toEqual([7]);
  });

  it('always includes the current page', () => {
    for (let page = 1; page <= 42; page++) {
      expect(getPaginationRange(page, 42)).toContain(page);
    }
  });
});
