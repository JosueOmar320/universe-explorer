/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { spaEntryPoints } from './build/spaEntryPoints.ts';

// https://vite.dev/config/
export default defineConfig({
  // Public path the app is served from. GitHub Pages serves project sites under
  // `/<repo>/`, so CI sets BASE_PATH; locally the app lives at `/`.
  // The router reads it back through `import.meta.env.BASE_URL`.
  base: process.env.BASE_PATH ?? '/',
  plugins: [
    react(),
    // Every available universe gets a real entry point (HTTP 200) on static hosting.
    spaEntryPoints({ universesDir: fileURLToPath(new URL('./src/universes', import.meta.url)) }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    restoreMocks: true,
    projects: [
      {
        // The app: browser-like environment with MSW, i18n and Testing Library set up.
        extends: true,
        test: {
          name: 'app',
          include: ['src/**/*.test.{ts,tsx}'],
          environment: 'jsdom',
          setupFiles: ['./src/test/setup.ts'],
        },
      },
      {
        // Build tooling: plain Node.
        extends: true,
        test: { name: 'build', include: ['build/**/*.test.ts'], environment: 'node' },
      },
    ],
  },
});
