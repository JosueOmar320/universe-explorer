import type { ApiClientConfig } from '@/shared/api/httpClient';

function resolveBaseUrl(fromEnv: string | undefined, fallback: string): string {
  return (fromEnv?.trim() || fallback).replace(/\/+$/, '');
}

/**
 * Configuration of every external API, in one place. Base URLs can be overridden with
 * environment variables (see `.env.example`), e.g. to go through a proxy or a mock server.
 */
export const apiConfig = {
  rickAndMorty: {
    baseUrl: resolveBaseUrl(
      import.meta.env.VITE_RICK_AND_MORTY_API_URL,
      'https://rickandmortyapi.com/api',
    ),
    timeoutMs: 10_000,
  },
} as const satisfies Record<string, ApiClientConfig>;
