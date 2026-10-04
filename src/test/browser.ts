import { http, HttpResponse } from 'msw';
import { setupWorker } from 'msw/browser';
import { apiHandlers } from './handlers';

// Neutral stand-in for remote pictures (avatars, sprites, fixture URLs), so mocked runs
// never leave the machine. The app's own images load normally.
const PLACEHOLDER_IMAGE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" fill="#8a8f99"/></svg>`;

const remoteImageHandler = http.get(/\.(?:png|jpe?g|gif|webp|svg)$/, ({ request }) => {
  if (new URL(request.url).origin === location.origin) return;
  return new HttpResponse(PLACEHOLDER_IMAGE, { headers: { 'Content-Type': 'image/svg+xml' } });
});

/**
 * Serves every API from fixtures through a service worker. Started by `main.tsx` in `mock`
 * mode only (`npm run dev:mock`, end-to-end tests); production builds never include it.
 */
export async function startApiMocks(): Promise<void> {
  const worker = setupWorker(...apiHandlers, remoteImageHandler);
  await worker.start({
    serviceWorker: { url: `${import.meta.env.BASE_URL}mockServiceWorker.js` },
    quiet: true,
    // The app's own files load normally; any other host must be mocked.
    onUnhandledRequest(request, print) {
      if (new URL(request.url).origin !== location.origin) print.error();
    },
  });
}
