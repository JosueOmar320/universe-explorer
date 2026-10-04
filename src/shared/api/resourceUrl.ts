/**
 * Extracts the numeric id from a REST resource URL, with or without a trailing slash:
 * `.../episode/28` (Rick and Morty) or `.../pokemon-species/25/` (PokéAPI).
 */
export function getIdFromResourceUrl(url: string): number | undefined {
  const lastSegment = url.split('/').filter(Boolean).at(-1);
  const id = Number(lastSegment);
  return Number.isInteger(id) && id > 0 ? id : undefined;
}
