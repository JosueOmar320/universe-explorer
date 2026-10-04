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

const ROMAN_NUMERALS: [number, string][] = [
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I'],
];

/** Generations are numbered with Roman numerals in the games (1 → I, 9 → IX). */
export function toRomanNumeral(value: number): string {
  let rest = value;
  let result = '';
  for (const [amount, numeral] of ROMAN_NUMERALS) {
    while (rest >= amount) {
      result += numeral;
      rest -= amount;
    }
  }
  return result;
}

/**
 * PokéAPI measures height in decimetres and weight in hectograms; show metres and
 * kilograms, formatted for the current language ("0.4 m", "6 kg" / "6 kg").
 */
export function formatHeight(decimetres: number, language: string | undefined): string {
  return new Intl.NumberFormat(language, {
    style: 'unit',
    unit: 'meter',
    maximumFractionDigits: 1,
  }).format(decimetres / 10);
}

export function formatWeight(hectograms: number, language: string | undefined): string {
  return new Intl.NumberFormat(language, {
    style: 'unit',
    unit: 'kilogram',
    maximumFractionDigits: 1,
  }).format(hectograms / 10);
}
