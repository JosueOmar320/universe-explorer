/** Error thrown for non-2xx responses, keeping the status so callers can branch on it. */
export class HttpError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}

export function isHttpError(error: unknown, status?: number): error is HttpError {
  return error instanceof HttpError && (status === undefined || error.status === status);
}

/**
 * Thin `fetch` wrapper for JSON APIs.
 *
 * The response is cast to `T` without runtime validation: the APIs we consume are public
 * and stable, so a schema library (e.g. Zod) would add weight without much benefit yet.
 */
export async function fetchJson<T>(url: string | URL, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: { Accept: 'application/json', ...init?.headers },
  });

  if (!response.ok) {
    throw new HttpError(response.status, `Request to ${String(url)} failed (${response.status})`);
  }

  return (await response.json()) as T;
}
