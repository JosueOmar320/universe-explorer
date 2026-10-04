import { HttpError } from './httpClient';

/** What went wrong, from the user's point of view. Drives error messages and retries. */
export type ApiErrorKind =
  'network' | 'timeout' | 'rate-limit' | 'not-found' | 'server' | 'unknown';

function hasName(error: unknown, name: string): boolean {
  return typeof error === 'object' && error !== null && 'name' in error && error.name === name;
}

export function getApiErrorKind(error: unknown): ApiErrorKind {
  if (error instanceof HttpError) {
    if (error.status === 404) return 'not-found';
    if (error.status === 429) return 'rate-limit';
    if (error.status >= 500) return 'server';
    return 'unknown';
  }
  // Raised by AbortSignal.timeout() (DOMException named "TimeoutError").
  if (hasName(error, 'TimeoutError')) return 'timeout';
  // fetch() rejects with a TypeError when the request never got a response
  // (offline, DNS failure, or a blocked CORS response).
  if (error instanceof TypeError) return 'network';
  return 'unknown';
}
