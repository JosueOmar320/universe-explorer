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
