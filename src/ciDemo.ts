// ⚠️ Deliberately broken file to exercise the CI pipeline. DO NOT MERGE.

// Fixed lint: `unknown` instead of `any`.
export function parseLegacyPayload(payload: unknown) {
  return payload;
}

// Type error: a string where a number is expected.
export const pageSize: number = '20';

// Fixed formatting: run through Prettier.
export const badlyFormatted = { a: 1, b: 2 };
