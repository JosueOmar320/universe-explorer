import { expect, test } from './fixtures.ts';
import { universes } from './universes.ts';

for (const universe of universes) {
  test.describe(universe.name, () => {
    test('searches, opens a record and comes back to the same results', async ({ page }) => {
      const { label, query, result } = universe.search;
      await page.goto(universe.path);
      const main = page.getByRole('main');
      await expect(main.getByRole('link', { name: universe.firstRecord })).toBeVisible();

      await main.getByRole('searchbox', { name: label }).fill(query);

      // The query lands in the URL, so results can be shared and survive a reload.
      await expect(page).toHaveURL(new RegExp(`[?&]\\w+=${query}`));
      await main.getByRole('link', { name: result }).click();

      await expect(page.getByRole('heading', { level: 1, name: result })).toBeVisible();
      await expect(main).toBeFocused();

      await main.getByRole('link', { name: universe.backLink }).click();

      await expect(main.getByRole('searchbox', { name: label })).toHaveValue(query);
      await expect(main.getByRole('link', { name: result })).toBeVisible();
    });

    test('loads a detail page from a direct link', async ({ page }) => {
      await page.goto(universe.detail.path);

      await expect(
        page.getByRole('heading', { level: 1, name: universe.detail.heading }),
      ).toBeVisible();
      await expect(page).toHaveTitle(new RegExp(`^${universe.detail.heading} · `));
    });
  });
}
