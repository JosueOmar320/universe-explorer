import { readFile } from 'node:fs/promises';

/**
 * Prints the Lighthouse CI results as Markdown: the scores of each page and, when something
 * failed, which assertions and what the browser console said. CI appends it to the job summary,
 * so a failure can be understood without downloading the reports.
 */
const CATEGORIES = ['performance', 'accessibility', 'best-practices', 'seo'] as const;

interface ManifestEntry {
  url: string;
  isRepresentativeRun: boolean;
  jsonPath: string;
  summary: Record<(typeof CATEGORIES)[number], number>;
}

interface AssertionResult {
  url: string;
  auditId?: string;
  /** e.g. `script.size` for resource-summary budgets. */
  auditProperty?: string;
  name: string;
  level: 'error' | 'warn';
  operator: string;
  expected: number;
  values: number[];
  passed: boolean;
}

interface ConsoleError {
  source?: string;
  description?: string;
  sourceLocation?: { url?: string };
}

const readJson = async <T>(path: string): Promise<T | undefined> => {
  try {
    return JSON.parse(await readFile(path, 'utf8')) as T;
  } catch {
    return undefined; // Not produced (e.g. the run stopped before that step).
  }
};

const pathname = (url: string) => new URL(url).pathname;
const formatValue = (value: number) =>
  Number.isInteger(value) || value > 10 ? String(Math.round(value)) : value.toFixed(2);

const manifest = (await readJson<ManifestEntry[]>('.lighthouseci/reports/manifest.json')) ?? [];
const assertions =
  (await readJson<AssertionResult[]>('.lighthouseci/assertion-results.json')) ?? [];
const lines: string[] = ['### Lighthouse (mobile, median run)', ''];

lines.push(
  '| Page | Performance | Accessibility | Best practices | SEO |',
  '| ---- | ----------: | ------------: | -------------: | --: |',
  ...manifest
    .filter(({ isRepresentativeRun }) => isRepresentativeRun)
    .map(({ url, summary }) => {
      const scores = CATEGORIES.map((category) => Math.round(summary[category] * 100));
      return `| \`${pathname(url)}\` | ${scores.join(' | ')} |`;
    }),
);

const failed = assertions.filter(({ passed }) => !passed);
if (failed.length > 0) {
  lines.push(
    '',
    '#### Assertions not met',
    '',
    '| Page | Level | Assertion | Expected | Every run |',
    '| ---- | ----- | --------- | -------: | --------- |',
    ...failed.map(
      ({ url, level, auditId, auditProperty, name, operator, expected, values }) =>
        `| \`${pathname(url)}\` | ${level} | ${[auditId ?? name, auditProperty].filter(Boolean).join(' ')} | ${operator} ${formatValue(expected)} | ${values.map(formatValue).join(', ')} |`,
    ),
  );
}

// Console errors (e.g. an API answering 429 or 5xx) are what usually costs best practices.
const consoleErrors: string[] = [];
for (const entry of manifest.filter(({ summary }) => summary['best-practices'] < 1)) {
  const report = await readJson<{
    audits: Record<string, { details?: { items?: ConsoleError[] } }>;
  }>(entry.jsonPath);
  for (const item of report?.audits['errors-in-console']?.details?.items ?? []) {
    const where = item.sourceLocation?.url ?? '';
    consoleErrors.push(
      `- \`${pathname(entry.url)}\` (${item.source ?? 'console'}): ${item.description ?? ''} ${where}`.trim(),
    );
  }
}
if (consoleErrors.length > 0) {
  lines.push(
    '',
    '#### Console errors in runs below 100 on best practices',
    '',
    ...new Set(consoleErrors),
  );
}

console.log(lines.join('\n'));
