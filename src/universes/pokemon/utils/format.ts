/** National Pokédex number, e.g. `25` → `#0025`. */
export function formatDexNumber(id: number): string {
  return `#${String(id).padStart(4, '0')}`;
}

/**
 * PokéAPI identifiers are slugs (`mr-mime`, `nidoran-f`). Lists show them as titles; the
 * official localized name is only available per species (detail view).
 */
export function formatPokemonName(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
