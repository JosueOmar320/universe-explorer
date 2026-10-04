export interface PageOf<T> {
  items: T[];
  totalCount: number;
  totalPages: number;
}

/** Client-side pagination for data that is already in memory (1-based pages). */
export function paginate<T>(items: readonly T[], page: number, pageSize: number): PageOf<T> {
  const start = (page - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    totalCount: items.length,
    totalPages: Math.ceil(items.length / pageSize),
  };
}
