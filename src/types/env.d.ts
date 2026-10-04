/// <reference types="vite/client" />

/** Environment variables available to the app (only `VITE_*` ones reach the browser). */
interface ImportMetaEnv {
  readonly VITE_RICK_AND_MORTY_API_URL?: string;
  readonly VITE_POKEAPI_URL?: string;
  readonly VITE_POKEMON_SPRITES_URL?: string;
  readonly VITE_SWAPI_URL?: string;
  readonly VITE_POTTERDB_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
