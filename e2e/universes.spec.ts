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

test('opening a record morphs its name into the page heading', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Same behaviour on every viewport');
  // Records which elements carry the shared transition name when each snapshot is taken.
  await page.addInitScript(() => {
    const named = () =>
      [...document.querySelectorAll('h1, h2, h3')]
        .filter((element) => getComputedStyle(element).viewTransitionName === 'record-name')
        .map((element) => `${element.tagName} ${element.textContent?.trim()}`);
    const log: { before: string[]; after?: string[] }[] = [];
    Object.assign(window, { viewTransitions: log });
    const start = document.startViewTransition.bind(document);
    document.startViewTransition = ((update: () => void) => {
      const entry: { before: string[]; after?: string[] } = { before: named() };
      log.push(entry);
      const transition = start(update);
      void transition.updateCallbackDone.then(() => (entry.after = named()));
      return transition;
    }) as typeof document.startViewTransition;
  });
  await page.goto('/star-wars');
  const main = page.getByRole('main');

  await main.getByRole('link', { name: 'Luke Skywalker' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Luke Skywalker' })).toBeVisible();

  // Only the clicked card carries the name (names must be unique), then the detail heading.
  await expect
    .poll(() =>
      page.evaluate(() => (window as unknown as { viewTransitions: unknown }).viewTransitions),
    )
    .toEqual([{ before: ['H3 Luke Skywalker'], after: ['H1 Luke Skywalker'] }]);
});
