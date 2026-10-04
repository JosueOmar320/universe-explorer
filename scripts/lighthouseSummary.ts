import { readFile } from 'node:fs/promises';

/**
 * Prints the Lighthouse CI scores of each page as a Markdown table. CI appends it to the job
 * summary, so the scores are visible on every run without downloading the reports.
 */
const CATEGORIES = ['performance', 'accessibility', 'best-practices', 'seo'] as const;

interface ManifestEntry {
  url: string;
  isRepresentativeRun: boolean;
  summary: Record<(typeof CATEGORIES)[number], number>;
}

const manifestPath = process.argv[2] ?? '.lighthouseci/reports/manifest.json';
const manifest = JSON.parse(await readFile(manifestPath, 'utf8')) as ManifestEntry[];

const rows = manifest
  .filter(({ isRepresentativeRun }) => isRepresentativeRun)
  .map(({ url, summary }) => {
    const scores = CATEGORIES.map((category) => Math.round(summary[category] * 100));
    return `| \`${new URL(url).pathname}\` | ${scores.join(' | ')} |`;
  });

console.log(
  [
    '### Lighthouse (mobile, median run)',
    '',
    '| Page | Performance | Accessibility | Best practices | SEO |',
    '| ---- | ----------: | ------------: | -------------: | --: |',
    ...rows,
  ].join('\n'),
);
