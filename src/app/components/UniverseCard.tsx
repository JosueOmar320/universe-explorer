import { Link } from 'react-router';
import { ArrowRightIcon } from '@/shared/icons/icons';
import { cx } from '@/shared/utils/cx';
import { getUniversePath } from '@/universes/registry';
import type { Universe } from '@/universes/types';
import styles from './UniverseCard.module.css';

interface UniverseCardProps {
  universe: Universe;
  position: number;
}

export function UniverseCard({ universe, position }: UniverseCardProps) {
  const isAvailable = universe.status === 'available';
  const content = (
    <>
      <span className={styles.index} aria-hidden="true">
        {String(position).padStart(2, '0')}
      </span>
      <h3 className={styles.name}>{universe.name}</h3>
      <p className={styles.tagline}>{universe.tagline}</p>
      <span className={styles.footer}>
        {isAvailable ? (
          <>
            Enter universe <ArrowRightIcon size={18} className={styles.arrow} />
          </>
        ) : (
          'Coming soon'
        )}
      </span>
    </>
  );

  return (
    <article className={styles.card} style={{ '--card-accent': universe.accentColor }}>
      {isAvailable ? (
        <Link to={getUniversePath(universe.id)} className={styles.surface}>
          {content}
        </Link>
      ) : (
        <div className={cx(styles.surface, styles.upcoming)}>{content}</div>
      )}
    </article>
  );
}
