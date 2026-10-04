/// <reference types="vite/client" />

/** Environment variables available to the app (only `VITE_*` ones reach the browser). */
interface ImportMetaEnv {
  readonly VITE_RICK_AND_MORTY_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
