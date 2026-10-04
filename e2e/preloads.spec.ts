import type { Locator, Page } from '@playwright/test';
import { expect, test } from './fixtures.ts';
import { universes } from './universes.ts';

// The critical fonts are listed by hand in vite.config.ts (see build/spaEntryPoints.ts);
// these tests keep that list honest against what the browser actually renders.
const landingPages: { name: string; path: string; ready: (page: Page) => Locator }[] = [
  { name: 'home', path: '/', ready: (page) => page.getByRole('heading', { level: 1 }) },
  ...universes.map(({ name, path, firstRecord }) => ({
    name,
    // The trailing slash serves the universe's own index.html, as on GitHub Pages.
    path: `${path}/`,
    ready: (page: Page) => page.getByRole('main').getByRole('link', { name: firstRecord }),
  })),
];

test.describe('first views preload what they render', () => {
  for (const { name, path, ready } of landingPages) {
    test(`on the ${name} page`, async ({ page, isMobile }) => {
      test.skip(isMobile, 'Same HTML on every viewport');
      await page.goto(path);
      await expect(ready(page)).toBeVisible();

      const fonts = await page.evaluate(async () => {
        await document.fonts.ready;
        return {
          preloaded: document.querySelectorAll('link[rel="preload"][as="font"]').length,
          rendered: [...document.fonts].filter(({ status }) => status === 'loaded').length,
          notPreloaded: performance
            .getEntriesByType('resource')
            .filter((entry) => entry.name.endsWith('.woff2'))
            .filter((entry) => (entry as PerformanceResourceTiming).initiatorType !== 'link')
            .map((entry) => entry.name.split('/').pop()),
        };
      });

      // Every font the page renders was preloaded…
      expect(fonts.notPreloaded, 'fonts loaded without a preload').toEqual([]);
      // …and every preloaded font is rendered (an unused preload wastes the first bytes).
      expect(fonts.rendered, 'rendered font faces vs preloaded fonts').toBe(fonts.preloaded);

      if (path !== '/') {
        // The universe's route chunks are requested with the HTML, not after the main bundle.
        await expect(page.locator('link[rel="modulepreload"]').first()).toBeAttached();
      }
    });
  }
});
