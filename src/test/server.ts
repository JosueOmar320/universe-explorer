import { setupServer } from 'msw/node';
import { pokemonHandlers } from '@/universes/pokemon/test/handlers';
import { rickAndMortyHandlers } from '@/universes/rick-and-morty/test/handlers';

/** Mock API server shared by every test. Override per test with `server.use(...)`. */
export const server = setupServer(...rickAndMortyHandlers, ...pokemonHandlers);
