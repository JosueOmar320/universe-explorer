import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/shared/components/Skeleton';
import styles from './EpisodeLog.module.css';

const PLACEHOLDER_ROWS = 6;

/** Mirrors one season of the episode log while episodes load. */
export function EpisodeLogSkeleton() {
  const { t } = useTranslation('rickAndMorty');

  return (
    <div role="status">
      <span className="visually-hidden">{t('episodes.loading')}</span>
      <div className={styles.seasons} aria-hidden="true">
        <div>
          <Skeleton width="8rem" height="1.25rem" className={styles.seasonTitle} />
          <ul className={styles.episodes}>
            {Array.from({ length: PLACEHOLDER_ROWS }, (_, index) => (
              <li key={index} className={styles.episode}>
                <Skeleton width="3.5rem" height="0.875rem" className={styles.code} />
                <Skeleton width="70%" height="0.875rem" className={styles.episodeName} />
                <Skeleton width="40%" height="0.75rem" className={styles.airDate} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
