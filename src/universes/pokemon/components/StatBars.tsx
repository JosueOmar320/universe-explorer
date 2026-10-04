import { useTranslation } from 'react-i18next';
import { cx } from '@/shared/utils/cx';
import type { Pokemon } from '../api/models';
import styles from './StatBars.module.css';

/** Highest possible base stat in the games; bars are drawn relative to it. */
const MAX_BASE_STAT = 255;

export function StatBars({ stats }: { stats: Pokemon['stats'] }) {
  const { t, i18n } = useTranslation('pokemon');
  const total = stats.reduce((sum, stat) => sum + stat.value, 0);

  return (
    <dl className={styles.stats}>
      {stats.map(({ name, value }) => (
        <div key={name} className={styles.row}>
          <dt className={styles.label}>{t(`stats.${name}`)}</dt>
          <dd className={styles.value}>
            <span className={styles.number}>{value}</span>
            {/* Visual only: the number above already conveys the value. */}
            <span className={styles.track} aria-hidden="true">
              <span
                className={styles.bar}
                style={{ '--stat-ratio': value / MAX_BASE_STAT }}
                data-tier={value >= 100 ? 'high' : value >= 60 ? 'mid' : 'low'}
              />
            </span>
          </dd>
        </div>
      ))}
      <div className={cx(styles.row, styles.totalRow)}>
        <dt className={styles.label}>{t('stats.total')}</dt>
        <dd className={styles.value}>
          <span className={styles.number}>{total.toLocaleString(i18n.resolvedLanguage)}</span>
        </dd>
      </div>
    </dl>
  );
}
