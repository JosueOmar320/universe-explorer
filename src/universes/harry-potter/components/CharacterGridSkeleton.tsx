import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/shared/components/Skeleton';
import cardStyles from './CharacterCard.module.css';
import gridStyles from './CharacterGrid.module.css';

export function CharacterGridSkeleton({ count = 8 }: { count?: number }) {
  const { t } = useTranslation('harryPotter');

  return (
    <div role="status">
      <span className="visually-hidden">{t('characters.loading')}</span>
      <ul className={gridStyles.grid} aria-hidden="true">
        {Array.from({ length: count }, (_, index) => (
          <li key={index}>
            <div className={cardStyles.card}>
              <Skeleton height="2.75rem" />
              <div className={cardStyles.name}>
                <Skeleton width="75%" height="1.25rem" />
              </div>
              <div className={cardStyles.facts}>
                <Skeleton height="0.875rem" />
                <Skeleton height="0.875rem" />
                <Skeleton height="0.875rem" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
