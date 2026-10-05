/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { mockServiceWorker } from './build/mockServiceWorker.ts';
import { spaEntryPoints } from './build/spaEntryPoints.ts';

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  // Public path the app is served from. GitHub Pages serves project sites under
  // `/<repo>/`, so CI sets BASE_PATH; locally the app lives at `/`.
  // The router reads it back through `import.meta.env.BASE_URL`.
  base: process.env.BASE_PATH ?? '/',
  plugins: [
    react(),
    // Every available universe gets a real entry point (HTTP 200) on static hosting, which
    // preloads what its first view needs.
    spaEntryPoints({
      universesDir: fileURLToPath(new URL('./src/universes', import.meta.url)),
      appRoutes: ['favorites'],
      criticalFonts: {
        home: ['space-grotesk-latin-wght-normal'],
        universes: {
          'rick-and-morty': [
            'space-grotesk-latin-wght-normal',
            'chakra-petch-latin-700-normal',
            'ibm-plex-mono-latin-400-normal',
            'ibm-plex-mono-latin-500-normal',
          ],
          pokemon: ['space-grotesk-latin-wght-normal', 'rubik-latin-wght-normal'],
          'star-wars': [
            'space-grotesk-latin-wght-normal',
            'oxanium-latin-wght-normal',
            'share-tech-mono-latin-400-normal',
          ],
          'harry-potter': ['cinzel-latin-wght-normal', 'eb-garamond-latin-wght-normal'],
        },
      },
    }),
    // `mock` mode serves every API from fixtures through MSW (dev:mock, end-to-end tests).
    mode === 'mock' && mockServiceWorker(),
  ],
  build: {
    // Keep the mocked build away from `dist`, which is what gets deployed.
    outDir: mode === 'mock' ? 'dist-mock' : 'dist',
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      // App and build code only: tests, fixtures and mocks would inflate the numbers.
      include: ['src/**/*.{ts,tsx}', 'build/**/*.ts'],
      exclude: ['**/*.test.{ts,tsx}', '**/test/**', 'src/types/**', 'src/main.tsx'],
      reporter: ['text-summary', 'json-summary', 'html'],
      // Just under today's numbers (92% lines, 87% branches): a drop fails CI. Routing and
      // layouts are mostly wiring, covered by the end-to-end tests instead.
      thresholds: { statements: 90, lines: 90, functions: 90, branches: 85 },
    },
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
}));
