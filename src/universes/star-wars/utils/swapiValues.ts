const MISSING_VALUES = new Set(['', 'unknown', 'n/a', 'none']);

/** SWAPI's placeholder strings ("unknown", "n/a", "none") become `null`. */
export function parseSwapiText(value: string): string | null {
  const trimmed = value.trim();
  return MISSING_VALUES.has(trimmed.toLowerCase()) ? null : trimmed;
}

/** Numbers come as strings, sometimes with thousands separators ("1,358"). */
export function parseSwapiNumber(value: string): number | null {
  const text = parseSwapiText(value);
  if (text === null) return null;
  const number = Number(text.replace(/,/g, ''));
  return Number.isFinite(number) ? number : null;
}
