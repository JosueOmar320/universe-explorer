import { expect, test } from './fixtures.ts';
import { universes } from './universes.ts';

// The tightest layout the app supports: a 320px phone, in Spanish (the longer translations).
test.use({ viewport: { width: 320, height: 700 } });
test.beforeEach(async ({ page, isMobile }) => {
  test.skip(isMobile, 'Sets its own viewport');
  await page.addInitScript(() => localStorage.setItem('universe-explorer:language', 'es'));
});

const pages = [
  '/',
  '/nowhere',
  ...universes.flatMap(({ path, detail }) => [path, detail.path, `${path}?q=zzz`]),
];

test.describe('on a 320px phone in Spanish', () => {
  for (const path of pages) {
    test(`${path} has no horizontal scroll`, async ({ page }) => {
      await page.goto(path);
      await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
      await page.waitForLoadState('networkidle');

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, 'pixels of horizontal overflow').toBe(0);
    });
  }

  for (const universe of universes) {
    test(`the ${universe.name} pagination fits on one line`, async ({ page }) => {
      await page.goto(universe.path);
      const pagination = page.getByRole('main').getByRole('navigation').last();
      await expect(pagination).toBeVisible();

      const layout = await pagination.evaluate((nav) => {
        const status = nav.querySelector('p');
        const lineHeight = status ? parseFloat(getComputedStyle(status).lineHeight) : 0;
        return {
          statusLines: status ? Math.round(status.getBoundingClientRect().height / lineHeight) : 0,
          arrowWidths: [...nav.querySelectorAll('button svg')].map(
            (icon) => icon.getBoundingClientRect().width,
          ),
          fits: nav.getBoundingClientRect().right <= window.innerWidth,
        };
      });

      // "Página 1 / 3" used to wrap, squeezing the arrows down to nothing.
      expect(layout).toEqual({ statusLines: 1, arrowWidths: [18, 18], fits: true });
    });
  }
});
