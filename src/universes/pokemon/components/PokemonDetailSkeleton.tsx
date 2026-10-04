import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/shared/components/Skeleton';
import styles from './PokemonProfile.module.css';

export function PokemonDetailSkeleton() {
  const { t } = useTranslation('pokemon');

  return (
    <div role="status">
      <span className="visually-hidden">{t('detail.loading')}</span>
      <div className={styles.profile} aria-hidden="true">
        <Skeleton className={styles.artwork} />
        <div>
          <Skeleton width="10rem" height="0.875rem" />
          <Skeleton width="60%" height="3.5rem" className={styles.name} />
          <Skeleton width="35%" height="1.25rem" className={styles.genus} />
          <Skeleton width="100%" height="6rem" className={styles.entry} />
        </div>
      </div>
    </div>
  );
}
