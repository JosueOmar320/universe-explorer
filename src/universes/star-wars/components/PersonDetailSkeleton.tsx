import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/shared/components/Skeleton';
import styles from './PersonDossier.module.css';

export function PersonDetailSkeleton() {
  const { t } = useTranslation('starWars');

  return (
    <div role="status" className={styles.dossier}>
      <span className="visually-hidden">{t('detail.loading')}</span>
      <div aria-hidden="true">
        <Skeleton width="8rem" height="0.875rem" />
        <Skeleton width="60%" height="3rem" className={styles.name} />
        <Skeleton width="30%" height="1.25rem" className={styles.origin} />
        <div className={styles.columns}>
          <Skeleton height="12rem" />
          <Skeleton height="12rem" />
        </div>
      </div>
    </div>
  );
}
