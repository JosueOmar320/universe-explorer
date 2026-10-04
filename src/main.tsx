import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@/app/App';
import '@fontsource-variable/space-grotesk/index.css';
import '@/shared/styles/global.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element "#root" not found in index.html');
}

// `mock` mode (`npm run dev:mock`, end-to-end tests) serves the APIs from fixtures. MODE is
// replaced at build time, so production bundles drop this branch and the mocks entirely.
if (import.meta.env.MODE === 'mock') {
  const { startApiMocks } = await import('@/test/browser');
  await startApiMocks();
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
