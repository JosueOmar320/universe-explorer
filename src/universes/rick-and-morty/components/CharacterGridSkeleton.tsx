import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/shared/components/Skeleton';
import gridStyles from './CharacterGrid.module.css';
import cardStyles from './CharacterCard.module.css';

/** Widths of the four fact rows (species, gender, origin, location). */
const FACT_WIDTHS = ['60%', '45%', '80%', '70%'];

/** Mirrors the real grid/card layout so content doesn't jump when data arrives. */
export function CharacterGridSkeleton({ count = 8 }: { count?: number }) {
  const { t } = useTranslation('rickAndMorty');

  return (
    <div role="status">
      <span className="visually-hidden">{t('characters.loading')}</span>
      <ul className={gridStyles.grid} aria-hidden="true">
        {Array.from({ length: count }, (_, index) => (
          <li key={index}>
            <div className={cardStyles.card}>
              <Skeleton className={cardStyles.media} />
              <div className={cardStyles.body}>
                <Skeleton width="70%" height="1.25rem" />
                <div className={cardStyles.facts}>
                  {FACT_WIDTHS.map((width) => (
                    <Skeleton key={width} width={width} height="0.875rem" />
                  ))}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
