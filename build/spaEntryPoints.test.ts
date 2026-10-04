import { access, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import type { Rollup } from 'vite';
import { describe, expect, it } from 'vitest';
import { collectPreloads, findLandingModules, findUniverseRoutes } from './spaEntryPoints.ts';

const universesDir = fileURLToPath(new URL('../src/universes', import.meta.url));

describe('findUniverseRoutes', () => {
  it('finds every universe folder that registers routes', async () => {
    expect(await findUniverseRoutes(universesDir)).toEqual([
      'harry-potter',
      'pokemon',
      'rick-and-morty',
      'star-wars',
    ]);
  });
});

describe('findLandingModules', () => {
  it('keeps the lazy imports of routes without a path (layout and index page)', () => {
    const source = `
      export const route = {
        lazy: async () => ({ Component: (await import('./layout/Layout')).Layout }),
        children: [
          { index: true, lazy: () => import('./pages/ListPage') },
          { path: ':id', lazy: () => import('./pages/DetailPage') },
        ],
      };
    `;

    expect(findLandingModules(source, '/app/universe/routes.ts')).toEqual([
      '/app/universe/layout/Layout',
      '/app/universe/pages/ListPage',
    ]);
  });

  it.each(['harry-potter', 'pokemon', 'rick-and-morty', 'star-wars'])(
    'finds the layout and index page of %s',
    async (universe) => {
      const routesFile = join(universesDir, universe, 'routes.ts');
      const modules = findLandingModules(await readFile(routesFile, 'utf8'), routesFile);

      expect(modules).toEqual([
        expect.stringContaining(`/${universe}/layout/`),
        expect.stringContaining(`/${universe}/pages/`),
      ]);
      // They resolve to real files, so the build can match them to chunks.
      await Promise.all(modules.map((module) => access(`${module}.tsx`)));
    },
  );
});

describe('collectPreloads', () => {
  const chunk = (
    fileName: string,
    {
      imports = [] as string[],
      css = [] as string[],
      entry = false,
      facade = null as string | null,
    } = {},
  ) =>
    ({
      type: 'chunk',
      fileName,
      isEntry: entry,
      imports,
      facadeModuleId: facade,
      viteMetadata: { importedCss: new Set(css), importedAssets: new Set() },
    }) as unknown as Rollup.OutputChunk;

  const bundle = Object.fromEntries(
    [
      chunk('index.js', { entry: true, imports: ['react.js'], css: ['index.css'] }),
      chunk('react.js'),
      chunk('Layout.js', { facade: '/u/layout/Layout.tsx', css: ['Layout.css'] }),
      chunk('ListPage.js', {
        facade: '/u/pages/ListPage.tsx',
        imports: ['shared.js', 'react.js'],
        css: ['ListPage.css'],
      }),
      chunk('shared.js', { css: ['shared.css'] }),
      chunk('DetailPage.js', { facade: '/u/pages/DetailPage.tsx', css: ['DetailPage.css'] }),
    ].map((output) => [output.fileName, output]),
  ) as Rollup.OutputBundle;

  it('collects the landing chunks, their imports and CSS, minus the main bundle', () => {
    expect(collectPreloads(bundle, ['/u/layout/Layout', '/u/pages/ListPage'])).toEqual({
      scripts: ['Layout.js', 'ListPage.js', 'shared.js'],
      styles: ['Layout.css', 'ListPage.css', 'shared.css'],
    });
  });
});
