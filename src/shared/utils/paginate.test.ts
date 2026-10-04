import { describe, expect, it } from 'vitest';
import { paginate } from './paginate';

const items = Array.from({ length: 30 }, (_, index) => index + 1);

describe('paginate', () => {
  it('returns the requested page and the totals', () => {
    expect(paginate(items, 1, 24)).toEqual({
      items: items.slice(0, 24),
      totalCount: 30,
      totalPages: 2,
    });
    expect(paginate(items, 2, 24).items).toEqual([25, 26, 27, 28, 29, 30]);
  });

  it('returns no items for pages beyond the end', () => {
    expect(paginate(items, 3, 24).items).toEqual([]);
    expect(paginate([], 1, 24)).toEqual({ items: [], totalCount: 0, totalPages: 0 });
  });
});
