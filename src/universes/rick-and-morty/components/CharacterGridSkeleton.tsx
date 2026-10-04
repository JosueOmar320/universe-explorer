import { Skeleton } from '@/shared/components/Skeleton';
import gridStyles from './CharacterGrid.module.css';
import cardStyles from './CharacterCard.module.css';

/** Widths of the four fact rows (species, gender, origin, location). */
const FACT_WIDTHS = ['60%', '45%', '80%', '70%'];

/** Mirrors the real grid/card layout so content doesn't jump when data arrives. */
export function CharacterGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div role="status">
      <span className="visually-hidden">Loading characters…</span>
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
