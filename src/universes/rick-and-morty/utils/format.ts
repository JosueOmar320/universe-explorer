/** Archive-style record number, e.g. `1` → `#0001`. */
export function formatRecordId(id: number): string {
  return `#${String(id).padStart(4, '0')}`;
}
