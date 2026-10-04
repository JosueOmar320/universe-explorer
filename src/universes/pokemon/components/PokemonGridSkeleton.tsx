import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/shared/components/Skeleton';
import cardStyles from './PokemonCard.module.css';
import gridStyles from './PokemonGrid.module.css';

/** Mirrors the real grid/card layout so content doesn't jump when data arrives. */
export function PokemonGridSkeleton({ count = 12 }: { count?: number }) {
  const { t } = useTranslation('pokemon');

  return (
    <div role="status">
      <span className="visually-hidden">{t('pokedex.loading')}</span>
      <ul className={gridStyles.grid} aria-hidden="true">
        {Array.from({ length: count }, (_, index) => (
          <li key={index}>
            <div className={cardStyles.card}>
              <Skeleton className={cardStyles.media} />
              <div className={cardStyles.body}>
                <Skeleton width="3rem" height="0.75rem" />
                <Skeleton width="70%" height="1.25rem" />
                <div className={cardStyles.types}>
                  <Skeleton width="3.75rem" height="1.5rem" />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
