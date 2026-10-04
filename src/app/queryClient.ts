import { QueryClient } from '@tanstack/react-query';
import { isHttpError } from '@/shared/api/httpClient';

const MAX_RETRIES = 2;

/** Client errors (4xx) won't succeed on retry — except rate limiting (429). */
export function shouldRetry(failureCount: number, error: unknown): boolean {
  if (isHttpError(error) && error.status >= 400 && error.status < 500 && error.status !== 429) {
    return false;
  }
  return failureCount < MAX_RETRIES;
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
