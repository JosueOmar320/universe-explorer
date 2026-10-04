// ⚠️ Deliberately broken file to exercise the CI pipeline. DO NOT MERGE.

// Lint error: `any` is forbidden (typescript/no-explicit-any).
export function parseLegacyPayload(payload: any) {
  return payload;
}

// Type error: a string where a number is expected.
export const pageSize: number = '20';

// Formatting error: not formatted with Prettier on purpose.
export const   badlyFormatted = { a:1,b:2 }
