import { access, copyFile, mkdir, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import type { Plugin } from 'vite';

/**
 * Routes of the available universes: every `src/universes/<id>/` folder with a `routes.ts`.
 * TypeScript already guarantees that a universe is available if and only if its route is
 * registered (src/universes/routes.ts), so the folder list is the source of truth here.
 */
export async function findUniverseRoutes(universesDir: string): Promise<string[]> {
  const entries = await readdir(universesDir, { withFileTypes: true });
  const routes: string[] = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    try {
      await access(join(universesDir, entry.name, 'routes.ts'));
      routes.push(entry.name);
    } catch {
      // Not a universe folder.
    }
  }
  return routes.sort();
}

/**
 * Static hosts without SPA rewrites (GitHub Pages) only serve files that exist. This copies
 * `index.html` to:
 * - `<route>/index.html` for each universe, so those pages answer 200 (crawlers, link
 *   previews and audits treat 404s as broken pages);
 * - `404.html`, the fallback for every other path (e.g. dynamic detail pages), which still
 *   boots the app, just with a 404 status.
 */
export function spaEntryPoints({ universesDir }: { universesDir: string }): Plugin {
  return {
    name: 'spa-entry-points',
    apply: 'build',
    async writeBundle({ dir }) {
      if (!dir) return;
      const indexHtml = join(dir, 'index.html');

      await copyFile(indexHtml, join(dir, '404.html'));
      for (const route of await findUniverseRoutes(universesDir)) {
        const routeDir = join(dir, route);
        await mkdir(routeDir, { recursive: true });
        await copyFile(indexHtml, join(routeDir, 'index.html'));
      }
    },
  };
}
