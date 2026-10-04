import { readFile } from 'node:fs/promises';

/**
 * Prints the test coverage totals as a Markdown table. CI appends it to the job summary, next
 * to Vitest's own test report.
 */
const METRICS = ['lines', 'statements', 'functions', 'branches'] as const;

type Totals = Record<(typeof METRICS)[number], { pct: number; covered: number; total: number }>;

const summaryPath = process.argv[2] ?? 'coverage/coverage-summary.json';
const { total } = JSON.parse(await readFile(summaryPath, 'utf8')) as { total: Totals };

console.log(
  [
    '### Test coverage',
    '',
    '| Metric | Coverage | Covered |',
    '| ------ | -------: | ------: |',
    ...METRICS.map(
      (metric) =>
        `| ${metric[0]?.toUpperCase()}${metric.slice(1)} | ${total[metric].pct}% | ${total[metric].covered} / ${total[metric].total} |`,
    ),
  ].join('\n'),
);
