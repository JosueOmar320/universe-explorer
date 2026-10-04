import { describe, expect, it } from 'vitest';
import { HttpError } from '@/shared/api/httpClient';
import { shouldRetry } from './queryClient';

describe('shouldRetry', () => {
  it('does not retry client errors', () => {
    expect(shouldRetry(0, new HttpError(404, 'Not found'))).toBe(false);
    expect(shouldRetry(0, new HttpError(400, 'Bad request'))).toBe(false);
  });

  it('retries rate limiting, server and network errors up to the limit', () => {
    expect(shouldRetry(0, new HttpError(429, 'Too many requests'))).toBe(true);
    expect(shouldRetry(1, new HttpError(503, 'Unavailable'))).toBe(true);
    expect(shouldRetry(0, new TypeError('Failed to fetch'))).toBe(true);
    expect(shouldRetry(2, new HttpError(503, 'Unavailable'))).toBe(false);
  });
});
