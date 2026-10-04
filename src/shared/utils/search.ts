/** Lowercase, without accents, spaces or punctuation: "Mr. Mime" → "mrmime", "R2-D2" → "r2d2". */
export function normalizeSearchText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}
