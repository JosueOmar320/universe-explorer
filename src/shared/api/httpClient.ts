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

export interface ApiClientConfig {
  /** Base URL without a trailing slash, e.g. `https://rickandmortyapi.com/api`. */
  baseUrl: string;
  /** Requests slower than this are aborted with a `TimeoutError`. */
  timeoutMs: number;
}

type QueryValue = string | number;

/** Arrays repeat the key (`tag[]=a&tag[]=b`), as several APIs expect for multi-value filters. */
export type QueryParams = Record<string, QueryValue | readonly QueryValue[] | undefined>;

interface RequestOptions {
  /** Query string params; `undefined` and empty values are omitted. */
  params?: QueryParams;
  /** Cancellation signal (TanStack Query passes one to every query function). */
  signal?: AbortSignal;
}

export function buildUrl(baseUrl: string, path: string, params: QueryParams = {}): URL {
  const url = new URL(`${baseUrl}/${path.replace(/^\/+/, '')}`);
  for (const [key, value] of Object.entries(params)) {
    const values: readonly QueryValue[] = Array.isArray(value) ? value : [value];
    for (const item of values) {
      if (item !== undefined && item !== '') url.searchParams.append(key, String(item));
    }
  }
  return url;
}

function withTimeout(signal: AbortSignal | undefined, timeoutMs: number): AbortSignal {
  const timeout = AbortSignal.timeout(timeoutMs);
  return signal ? AbortSignal.any([signal, timeout]) : timeout;
}

/**
 * Minimal JSON client bound to one API's configuration. Each universe creates its own,
 * so services only deal with paths and params — never with hosts or fetch details.
 *
 * Responses are cast to `T` without runtime validation: the APIs we consume are public
 * and stable, so a schema library (e.g. Zod) would add weight without much benefit yet.
 */
export function createApiClient({ baseUrl, timeoutMs }: ApiClientConfig) {
  return {
    async get<T>(path: string, { params, signal }: RequestOptions = {}): Promise<T> {
      const url = buildUrl(baseUrl, path, params);
      const response = await fetch(url, {
        headers: { Accept: 'application/json' },
        signal: withTimeout(signal, timeoutMs),
      });

      if (!response.ok) {
        throw new HttpError(response.status, `GET ${url.pathname} failed (${response.status})`);
      }

      return (await response.json()) as T;
    },
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;
