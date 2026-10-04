/// <reference types="vite/client" />

/** Environment variables available to the app (only `VITE_*` ones reach the browser). */
interface ImportMetaEnv {
  readonly VITE_RICK_AND_MORTY_API_URL?: string;
  readonly VITE_POKEAPI_URL?: string;
  readonly VITE_POKEMON_ARTWORK_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
