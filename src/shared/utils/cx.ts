type ClassValue = string | false | null | undefined;

/** Joins truthy class names. Tiny replacement for `clsx` covering our use cases. */
export function cx(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(' ');
}
