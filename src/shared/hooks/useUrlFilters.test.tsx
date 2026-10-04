import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter, useLocation } from 'react-router';
import { describe, expect, it } from 'vitest';
import { pickOption } from '@/shared/utils/pickOption';
import { useUrlFilters } from './useUrlFilters';

interface Filters {
  q?: string;
  kind?: 'a' | 'b';
}

const KEYS = ['q', 'kind'] as const;
const parse = (params: URLSearchParams): Filters => ({
  q: params.get('q') || undefined,
  kind: pickOption(params.get('kind'), ['a', 'b'] as const),
});

function setup(initialEntry: string) {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <MemoryRouter initialEntries={[initialEntry]}>{children}</MemoryRouter>
  );
  return renderHook(() => ({ ...useUrlFilters(KEYS, parse), search: useLocation().search }), {
    wrapper,
  });
}

describe('useUrlFilters', () => {
  it('parses filters from the URL and counts the active ones', () => {
    const { result } = setup('/?q=rick&kind=zzz');

    expect(result.current.filters).toEqual({ q: 'rick', kind: undefined });
    expect(result.current.activeFilterCount).toBe(1);
  });

  it('resets pagination and keeps unrelated params when a filter changes', () => {
    const { result } = setup('/?page=3&view=grid');

    act(() => result.current.setFilter('kind', 'b'));

    expect(new URLSearchParams(result.current.search).toString()).toBe('view=grid&kind=b');
  });

  it('removes a filter when set to an empty value', () => {
    const { result } = setup('/?q=rick&kind=a');

    act(() => result.current.setFilter('q', ''));

    expect(result.current.search).toBe('?kind=a');
  });

  it('clears only its own filters', () => {
    const { result } = setup('/?q=rick&kind=a&page=2&view=grid');

    act(() => result.current.clearFilters());

    expect(result.current.search).toBe('?view=grid');
    expect(result.current.activeFilterCount).toBe(0);
  });
});
