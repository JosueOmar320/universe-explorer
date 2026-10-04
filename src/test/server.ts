import { setupServer } from 'msw/node';
import { apiHandlers } from './handlers';

/** Mock API server shared by every test. Override per test with `server.use(...)`. */
export const server = setupServer(...apiHandlers);
