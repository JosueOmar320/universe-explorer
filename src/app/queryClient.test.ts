import { describe, expect, it } from 'vitest';
import { HttpError } from '@/shared/api/httpClient';
import { shouldRetry } from './queryClient';

const timeoutError = new DOMException('The operation timed out.', 'TimeoutError');

describe('shouldRetry', () => {
  it('retries transient failures: network, server and rate limiting', () => {
    expect(shouldRetry(0, new TypeError('Failed to fetch'))).toBe(true);
    expect(shouldRetry(1, new HttpError(503, 'Unavailable'))).toBe(true);
    expect(shouldRetry(0, new HttpError(429, 'Too many requests'))).toBe(true);
  });

  it('gives up after the retry limit', () => {
    expect(shouldRetry(2, new HttpError(503, 'Unavailable'))).toBe(false);
  });

  it('does not retry errors that will not change', () => {
    expect(shouldRetry(0, new HttpError(404, 'Not found'))).toBe(false);
    expect(shouldRetry(0, new HttpError(400, 'Bad request'))).toBe(false);
    expect(shouldRetry(0, timeoutError)).toBe(false);
  });
});
