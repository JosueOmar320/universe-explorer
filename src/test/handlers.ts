import { harryPotterHandlers } from '@/universes/harry-potter/test/handlers';
import { pokemonHandlers } from '@/universes/pokemon/test/handlers';
import { rickAndMortyHandlers } from '@/universes/rick-and-morty/test/handlers';
import { starWarsHandlers } from '@/universes/star-wars/test/handlers';

/**
 * Every API mock, shared by the Node test server (Vitest) and the browser worker
 * (`npm run dev:mock` and the end-to-end tests).
 */
export const apiHandlers = [
  ...rickAndMortyHandlers,
  ...pokemonHandlers,
  ...starWarsHandlers,
  ...harryPotterHandlers,
];
