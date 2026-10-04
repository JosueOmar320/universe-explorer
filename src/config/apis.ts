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
  pokemon: {
    baseUrl: resolveBaseUrl(import.meta.env.VITE_POKEAPI_URL, 'https://pokeapi.co/api/v2'),
    timeoutMs: 10_000,
  },
  // swapi.info serves the classic SWAPI schema but returns every resource of a collection
  // in one response, which suits a small, static dataset (82 people) far better than
  // paginating through swapi.dev.
  starWars: {
    baseUrl: resolveBaseUrl(import.meta.env.VITE_SWAPI_URL, 'https://swapi.info/api'),
    timeoutMs: 10_000,
  },
} as const satisfies Record<string, ApiClientConfig>;

/** Static assets served outside the APIs (images are not fetched through the API client). */
export const assetConfig = {
  /**
   * PokéAPI's sprite repository. Image URLs are derived from a Pokédex number:
   * `<base>/<id>.png` (96px pixel sprite) and `<base>/other/official-artwork/<id>.png`.
   */
  pokemonSpritesBaseUrl: resolveBaseUrl(
    import.meta.env.VITE_POKEMON_SPRITES_URL,
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon',
  ),
} as const;
