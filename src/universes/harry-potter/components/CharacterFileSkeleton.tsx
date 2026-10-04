import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/shared/components/Skeleton';
import styles from './CharacterFile.module.css';

export function CharacterFileSkeleton() {
  const { t } = useTranslation('harryPotter');

  return (
    <div role="status" className={styles.file}>
      <span className="visually-hidden">{t('detail.loading')}</span>
      <div aria-hidden="true">
        <Skeleton height="6rem" />
        <div className={styles.columns}>
          <Skeleton height="16rem" />
          <Skeleton height="16rem" />
        </div>
      </div>
    </div>
  );
}
