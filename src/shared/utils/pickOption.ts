/** Returns `value` narrowed to one of `allowed`, or `undefined` if it isn't one (e.g. a bad URL param). */
export function pickOption<T extends string>(
  value: string | null | undefined,
  allowed: readonly T[],
): T | undefined {
  return allowed.find((option) => option === value);
}
