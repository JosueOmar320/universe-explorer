import { setupServer } from 'msw/node';
import { rickAndMortyHandlers } from '@/universes/rick-and-morty/test/handlers';

/** Mock API server shared by every test. Override per test with `server.use(...)`. */
export const server = setupServer(...rickAndMortyHandlers);
