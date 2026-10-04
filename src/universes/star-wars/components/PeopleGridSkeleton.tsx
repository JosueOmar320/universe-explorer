import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/shared/components/Skeleton';
import cardStyles from './PersonCard.module.css';
import gridStyles from './PeopleGrid.module.css';

export function PeopleGridSkeleton({ count = 6 }: { count?: number }) {
  const { t } = useTranslation('starWars');

  return (
    <div role="status">
      <span className="visually-hidden">{t('people.loading')}</span>
      <ul className={gridStyles.grid} aria-hidden="true">
        {Array.from({ length: count }, (_, index) => (
          <li key={index}>
            <div className={cardStyles.card}>
              <Skeleton width="45%" height="0.75rem" />
              <Skeleton width="75%" height="1.5rem" className={cardStyles.name} />
              <Skeleton width="50%" height="0.875rem" />
              <div className={cardStyles.metrics}>
                <Skeleton height="2rem" />
                <Skeleton height="2rem" />
                <Skeleton height="2rem" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
