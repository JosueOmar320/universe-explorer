import type { PokedexEntry } from '../api/models';

/** Lowercase, without accents, spaces or punctuation: "Mr. Mime" → "mrmime". */
export function normalizeSearchText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

interface PokedexFilter {
  /** Free text: part of a name, or a Pokédex number (`25`, `#25`, `0025`). */
  query?: string;
  /** Restrict to these Pokédex numbers (e.g. the species of a type). */
  ids?: readonly number[];
}

/**
 * Filters the Pokédex index in memory. A numeric query matches Pokédex numbers that start
 * with it (`25` → #25, #250–259), so results narrow down as the user types.
 */
export function filterPokedex(
  entries: readonly PokedexEntry[],
  { query = '', ids }: PokedexFilter,
): PokedexEntry[] {
  const allowedIds = ids ? new Set(ids) : undefined;
  const normalizedQuery = normalizeSearchText(query);
  const numberQuery = /^\d+$/.test(normalizedQuery) ? String(Number(normalizedQuery)) : undefined;

  return entries.filter((entry) => {
    if (allowedIds && !allowedIds.has(entry.id)) return false;
    if (!normalizedQuery) return true;
    if (numberQuery !== undefined) return String(entry.id).startsWith(numberQuery);
    return normalizeSearchText(entry.name).includes(normalizedQuery);
  });
}
