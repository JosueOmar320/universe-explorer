/** Archive record number, e.g. `1` → `0001`. */
export function formatRecordNumber(id: number): string {
  return String(id).padStart(4, '0');
}

export function formatCentimetres(value: number, language: string | undefined): string {
  return new Intl.NumberFormat(language, { style: 'unit', unit: 'centimeter' }).format(value);
}

export function formatKilograms(value: number, language: string | undefined): string {
  return new Intl.NumberFormat(language, { style: 'unit', unit: 'kilogram' }).format(value);
}

const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];

/** Saga episodes are numbered with Roman numerals (4 → IV). */
export function formatEpisode(episode: number): string {
  return ROMAN[episode] ?? String(episode);
}
