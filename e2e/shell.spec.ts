import { expect, test } from './fixtures.ts';
import { universes } from './universes.ts';

test('the home page links to every universe', async ({ page }) => {
  await page.goto('/');
  const main = page.getByRole('main');

  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    /One shell\.\s*Many universes\./,
  );
  for (const { name } of universes) {
    await expect(main.getByRole('link', { name })).toBeVisible();
  }

  await main.getByRole('link', { name: 'Pokémon' }).click();

  await expect(page).toHaveURL('/pokemon');
  // Focus follows the navigation, so keyboard and screen reader users start at the content.
  await expect(main).toBeFocused();
});

test('the header switches universes and re-themes the page', async ({ page }) => {
  await page.goto('/rick-and-morty');
  const nav = page.getByRole('navigation', { name: 'Universes' });
  const shell = page.locator('[data-universe]');
  await expect(shell).toHaveAttribute('data-universe', 'rick-and-morty');

  await nav.getByRole('link', { name: 'Harry Potter' }).click();

  await expect(page).toHaveURL('/harry-potter');
  await expect(shell).toHaveAttribute('data-universe', 'harry-potter');
});

test('the language choice survives a reload', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Español' }).click();

  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    /Un shell\.\s*Muchos universos\./,
  );

  await page.reload();

  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.getByRole('button', { name: 'Español' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
});

test('the skip link jumps to the main content', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Keyboard navigation');
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  await page.keyboard.press('Tab');
  const skipLink = page.getByRole('link', { name: 'Skip to content' });
  await expect(skipLink).toBeFocused();
  await page.keyboard.press('Enter');

  await expect(page.getByRole('main')).toBeFocused();
});

test('unknown addresses show a way back home', async ({ page }) => {
  await page.goto('/nowhere');

  await expect(page.getByRole('heading', { level: 1, name: 'Page not found' })).toBeVisible();
  await page.getByRole('main').getByRole('link', { name: 'Back to universes' }).click();

  await expect(page).toHaveURL('/');
});

test('the global search finds records in any universe', async ({ page, isMobile }) => {
  await page.goto('/pokemon');
  const search = page.getByRole('button', { name: 'Search' });
  await expect(search).toBeVisible();

  // Escape (handled natively by <dialog>) dismisses it and gives focus back.
  if (!isMobile) {
    await search.focus();
    await page.keyboard.press('ControlOrMeta+k');
    await expect(page.getByRole('dialog', { name: 'Search every universe' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toBeHidden();
    await expect(search).toBeFocused();
  }

  await search.click();
  const combobox = page.getByRole('combobox', { name: 'Search characters in every universe' });
  await expect(combobox).toBeFocused();
  await combobox.fill('hermione');
  await page.getByRole('option', { name: /Hermione Jean Granger/ }).click();

  await expect(page).toHaveURL('/harry-potter/hermione-granger');
  await expect(
    page.getByRole('heading', { level: 1, name: 'Hermione Jean Granger' }),
  ).toBeVisible();
});

test('favorites are saved from a record, listed and kept after a reload', async ({ page }) => {
  await page.goto('/star-wars/people/1');
  const star = page.getByRole('button', { name: 'Save Luke Skywalker to favorites' });

  await star.click();

  await expect(star).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('link', { name: 'Favorites, 1 saved' }).click();
  await expect(page).toHaveURL('/favorites');
  const starWars = page.getByRole('region', { name: 'Star Wars' });
  await expect(starWars.getByRole('link', { name: 'Luke Skywalker' })).toBeVisible();

  await page.reload();
  await expect(starWars.getByRole('link', { name: 'Luke Skywalker' })).toBeVisible();

  await page.getByRole('button', { name: 'Remove Luke Skywalker from favorites' }).click();
  await expect(page.getByRole('heading', { level: 2, name: 'No favorites yet' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Favorites', exact: true })).toBeVisible();
});
