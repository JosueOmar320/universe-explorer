import { QueryClient } from '@tanstack/react-query';
import { type ApiErrorKind, getApiErrorKind } from '@/shared/api/errors';

const MAX_RETRIES = 2;

/**
 * Only transient failures are worth retrying. Not found/client errors won't change, and a
 * timed-out request already made the user wait for the whole timeout.
 */
const RETRYABLE_ERRORS: readonly ApiErrorKind[] = ['network', 'server', 'rate-limit'];

export function shouldRetry(failureCount: number, error: unknown): boolean {
  return failureCount < MAX_RETRIES && RETRYABLE_ERRORS.includes(getApiErrorKind(error));
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // The public datasets we consume rarely change, so cached data stays fresh for a while.
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: shouldRetry,
    },
  },
});
