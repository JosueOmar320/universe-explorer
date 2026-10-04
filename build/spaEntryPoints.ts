import { access, readFile, readdir, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { parseAst, type Plugin, type Rollup } from 'vite';

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

interface AstNode {
  type: string;
  [key: string]: unknown;
}

const isNode = (value: unknown): value is AstNode =>
  typeof value === 'object' && value !== null && typeof (value as AstNode).type === 'string';

function* walk(node: unknown): Generator<AstNode> {
  if (Array.isArray(node)) {
    for (const child of node) yield* walk(child);
  } else if (isNode(node)) {
    yield node;
    for (const value of Object.values(node)) yield* walk(value);
  }
}

const findProperty = (object: AstNode, name: string): AstNode | undefined =>
  (object.properties as AstNode[]).find(
    (property) =>
      property.type === 'Property' && isNode(property.key) && property.key.name === name,
  );

/**
 * Modules a universe's own URL renders, read from its `routes.ts`: the lazy imports of every
 * route without a `path` (the universe layout and its index page). Detail routes have a path.
 * Returns absolute paths without extension.
 */
export function findLandingModules(routesSource: string, routesFile: string): string[] {
  const modules: string[] = [];
  for (const node of walk(parseAst(routesSource, { lang: 'ts' }))) {
    if (node.type !== 'ObjectExpression') continue;
    const lazy = findProperty(node, 'lazy');
    if (!lazy || findProperty(node, 'path')) continue;
    for (const inner of walk(lazy.value)) {
      if (inner.type === 'ImportExpression' && isNode(inner.source)) {
        modules.push(resolve(dirname(routesFile), String(inner.source.value)));
      }
    }
  }
  return modules;
}

const withoutExtension = (file: string) => file.replace(/\.[^./]+$/, '');

/**
 * Files the landing page of a universe downloads after the main bundle: the chunks of its
 * landing modules, the chunks those import (minus what the main bundle already loads) and
 * their CSS.
 */
export function collectPreloads(
  bundle: Rollup.OutputBundle,
  landingModules: string[],
): { scripts: string[]; styles: string[] } {
  const chunks = Object.values(bundle).filter(
    (output): output is Rollup.OutputChunk => output.type === 'chunk',
  );
  const byFileName = new Map(chunks.map((chunk) => [chunk.fileName, chunk]));
  const loadedByEntry = new Set(
    chunks
      .filter(({ isEntry }) => isEntry)
      .flatMap(({ fileName, imports }) => [fileName, ...imports]),
  );

  const scripts = new Set<string>();
  const styles = new Set<string>();
  const visit = (chunk: Rollup.OutputChunk) => {
    if (loadedByEntry.has(chunk.fileName) || scripts.has(chunk.fileName)) return;
    scripts.add(chunk.fileName);
    for (const css of chunk.viteMetadata?.importedCss ?? []) styles.add(css);
    for (const fileName of chunk.imports) {
      const imported = byFileName.get(fileName);
      if (imported) visit(imported);
    }
  };

  const wanted = new Set(landingModules);
  for (const chunk of chunks) {
    if (chunk.facadeModuleId && wanted.has(withoutExtension(chunk.facadeModuleId))) visit(chunk);
  }
  return { scripts: [...scripts], styles: [...styles] };
}

const addToHead = (html: string, tags: string[]) =>
  tags.length === 0 ? html : html.replace('</head>', `  ${tags.join('\n    ')}\n  </head>`);

export interface SpaEntryPointsOptions {
  universesDir: string;
  /**
   * Fonts each landing page renders, as emitted file names without hash
   * (`<family>-latin-<weight>-normal`). Which faces a first view uses can't be read from the
   * CSS (it depends on what renders), so they're listed by hand and checked by
   * e2e/preloads.spec.ts.
   */
  criticalFonts: { home: string[]; universes: Record<string, string[]> };
}

/**
 * Static hosts without SPA rewrites (GitHub Pages) only serve files that exist. This writes:
 * - `<route>/index.html` for each universe, so those pages answer 200 (crawlers, link
 *   previews and audits treat 404s as broken pages);
 * - `404.html`, the fallback for every other path (e.g. dynamic detail pages), which still
 *   boots the app, just with a 404 status.
 *
 * It also adds preloads. Without them a universe page downloads in a chain — main bundle,
 * then (once the router matches the URL) the universe's chunks and CSS, then its fonts — and
 * on a slow connection each step costs a round trip before the first paint.
 */
export function spaEntryPoints({ universesDir, criticalFonts }: SpaEntryPointsOptions): Plugin {
  let base = '/';

  return {
    name: 'spa-entry-points',
    apply: 'build',
    configResolved(config) {
      base = config.base;
    },
    async writeBundle({ dir }, bundle) {
      if (!dir) return;
      const routes = await findUniverseRoutes(universesDir);
      for (const id of Object.keys(criticalFonts.universes)) {
        if (!routes.includes(id)) this.error(`criticalFonts lists an unknown universe: "${id}"`);
      }

      const fontFile = (name: string) => {
        const matches = Object.keys(bundle).filter(
          (file) => file.startsWith(`assets/${name}-`) && file.endsWith('.woff2'),
        );
        if (matches.length !== 1) {
          this.error(`Critical font "${name}" matches ${matches.length} files in the build`);
        }
        return matches[0];
      };
      // `crossorigin` matches how Vite and CSS request these files, so the preloads are reused.
      const fontTags = (names: string[] = []) =>
        names.map(
          (name) =>
            `<link rel="preload" as="font" type="font/woff2" crossorigin href="${base}${fontFile(name)}">`,
        );

      // The fallback serves any page of any universe, so it preloads nothing.
      const indexHtml = join(dir, 'index.html');
      const html = await readFile(indexHtml, 'utf8');
      await writeFile(join(dir, '404.html'), html);
      await writeFile(indexHtml, addToHead(html, fontTags(criticalFonts.home)));

      for (const route of routes) {
        const routesFile = join(universesDir, route, 'routes.ts');
        const landingModules = findLandingModules(await readFile(routesFile, 'utf8'), routesFile);
        const { scripts, styles } = collectPreloads(bundle, landingModules);
        const tags = [
          ...scripts.map((file) => `<link rel="modulepreload" crossorigin href="${base}${file}">`),
          ...styles.map(
            (file) => `<link rel="preload" as="style" crossorigin href="${base}${file}">`,
          ),
          ...fontTags(criticalFonts.universes[route]),
        ];

        await mkdir(join(dir, route), { recursive: true });
        await writeFile(join(dir, route, 'index.html'), addToHead(html, tags));
      }
    },
  };
}
