import { describe, expect, it } from 'vitest';
import { getApiErrorKind } from './errors';
import { HttpError } from './httpClient';

describe('getApiErrorKind', () => {
  it.each([
    [new HttpError(404, ''), 'not-found'],
    [new HttpError(429, ''), 'rate-limit'],
    [new HttpError(500, ''), 'server'],
    [new HttpError(503, ''), 'server'],
    [new HttpError(400, ''), 'unknown'],
    [new DOMException('Timed out', 'TimeoutError'), 'timeout'],
    [new TypeError('Failed to fetch'), 'network'],
    [new SyntaxError('Unexpected token'), 'unknown'],
    ['boom', 'unknown'],
  ])('classifies %o as %s', (error, kind) => {
    expect(getApiErrorKind(error)).toBe(kind);
  });
});
