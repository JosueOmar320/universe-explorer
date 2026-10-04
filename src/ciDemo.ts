// ⚠️ Deliberately broken file to exercise the CI pipeline. DO NOT MERGE.

// Fixed lint: `unknown` instead of `any`.
export function parseLegacyPayload(payload: unknown) {
  return payload;
}

// Fixed type: a number, as declared.
export const pageSize: number = 20;

// Fixed formatting: run through Prettier.
export const badlyFormatted = { a: 1, b: 2 };
