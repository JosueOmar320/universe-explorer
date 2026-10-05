import { expect, test } from './fixtures.ts';
import { universes } from './universes.ts';

// Every page type, once its content has loaded: axe only sees what is rendered.
test.describe('axe finds no WCAG A/AA violations', () => {
  test('on the home page', async ({ page, expectAccessible }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    await expectAccessible();
  });

  test('on the home page in Spanish', async ({ page, expectAccessible }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Español' }).click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');

    await expectAccessible();
  });

  test('with the global search open', async ({ page, expectAccessible }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Search' }).click();
    await page.getByRole('combobox').fill('lu');
    await expect(page.getByRole('option').first()).toBeVisible();

    await expectAccessible();
  });

  test('on the favorites page', async ({ page, expectAccessible }) => {
    await page.addInitScript(() =>
      localStorage.setItem(
        'universe-explorer:favorites',
        JSON.stringify([
          {
            universe: 'pokemon',
            id: '25',
            name: 'Pikachu',
            detail: '#0025',
            href: '/pokemon/25',
            savedAt: 1,
          },
          {
            universe: 'harry-potter',
            id: 'x',
            name: 'Luna Lovegood',
            href: '/harry-potter/luna-lovegood',
            savedAt: 2,
          },
        ]),
      ),
    );
    await page.goto('/favorites');
    await expect(page.getByRole('link', { name: 'Pikachu' })).toBeVisible();

    await expectAccessible();
  });

  test('on the not-found page', async ({ page, expectAccessible }) => {
    await page.goto('/nowhere');
    await expect(page.getByRole('heading', { level: 1, name: 'Page not found' })).toBeVisible();

    await expectAccessible();
  });

  for (const universe of universes) {
    test(`on the ${universe.name} listing`, async ({ page, expectAccessible }) => {
      await page.goto(universe.path);
      await expect(
        page.getByRole('main').getByRole('link', { name: universe.firstRecord }),
      ).toBeVisible();

      await expectAccessible();
    });

    test(`on a ${universe.name} detail page`, async ({ page, expectAccessible }) => {
      await page.goto(universe.detail.path);
      await expect(
        page.getByRole('heading', { level: 1, name: universe.detail.heading }),
      ).toBeVisible();

      await expectAccessible();
    });
  }
});
