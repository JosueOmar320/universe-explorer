import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import type { Plugin } from 'vite';

const WORKER_FILE = 'mockServiceWorker.js';

/**
 * Serves MSW's service worker in `mock` mode (dev server and build).
 *
 * The worker is read from the installed `msw` package instead of being committed to `public/`,
 * so it always matches the library version and never ships with the production site.
 */
export function mockServiceWorker(): Plugin {
  const workerPath = createRequire(import.meta.url).resolve(`msw/${WORKER_FILE}`);

  return {
    name: 'mock-service-worker',

    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        if (request.url !== `${server.config.base}${WORKER_FILE}`) return next();
        readFile(workerPath).then((worker) => {
          response.setHeader('Content-Type', 'text/javascript');
          response.end(worker);
        }, next);
      });
    },

    async generateBundle() {
      this.emitFile({ type: 'asset', fileName: WORKER_FILE, source: await readFile(workerPath) });
    },
  };
}
