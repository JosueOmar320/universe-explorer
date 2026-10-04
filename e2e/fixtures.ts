import { AxeBuilder } from '@axe-core/playwright';
import { test as base, expect } from '@playwright/test';

// WCAG 2.2 level A and AA, the bar the app is built to.
const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

interface Fixtures {
  /** Runs axe on the current page and fails with a readable list of violations. */
  expectAccessible: () => Promise<void>;
}

export const test = base.extend<Fixtures>({
  // Every test also fails on uncaught exceptions and console errors, which include requests
  // to hosts without a mock (see src/test/browser.ts).
  page: async ({ page }, use) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      // HTTP errors are part of the APIs' behaviour (e.g. Rick and Morty answers "no results"
      // with a 404); the UI handling them is asserted by the tests themselves.
      if (message.type() === 'error' && !message.text().startsWith('Failed to load resource')) {
        errors.push(message.text());
      }
    });

    await use(page);

    expect(errors, 'uncaught errors or console errors').toEqual([]);
  },

  expectAccessible: async ({ page }, use) => {
    await use(async () => {
      const { violations, incomplete } = await new AxeBuilder({ page })
        .withTags(WCAG_TAGS)
        .analyze();
      const summary = violations.map(
        ({ id, help, nodes }) => `${id}: ${help} → ${nodes.map((node) => node.target).join(', ')}`,
      );
      expect(summary, 'axe violations').toEqual([]);
      expect(measuredLowContrast(incomplete), 'text below the WCAG AA contrast ratio').toEqual([]);
    });
  },
});

interface ContrastData {
  contrastRatio?: number;
  expectedContrastRatio?: string;
}

type AxeResults = Awaited<ReturnType<AxeBuilder['analyze']>>;

/**
 * axe files very short text (e.g. the "IV" film pips) under "needs review" even when it
 * measured a failing ratio, because it might be an icon. Lighthouse fails those, so do we.
 * Nodes it couldn't measure (text over gradients) report a ratio of 0 and are left out.
 */
function measuredLowContrast(incomplete: AxeResults['incomplete']): string[] {
  return incomplete
    .filter(({ id }) => id === 'color-contrast')
    .flatMap(({ nodes }) => nodes)
    .filter((node) => {
      const data = node.any[0]?.data as ContrastData | undefined;
      const ratio = data?.contrastRatio ?? 0;
      return ratio > 0 && ratio < Number.parseFloat(data?.expectedContrastRatio ?? '4.5');
    })
    .map((node) => `${node.target.join(' ')}: ${node.any[0]?.message}`);
}

export { expect };
