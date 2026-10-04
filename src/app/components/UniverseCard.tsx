import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { ArrowRightIcon } from '@/shared/icons/icons';
import { cx } from '@/shared/utils/cx';
import { getUniversePath, isUniverseAvailable } from '@/universes/registry';
import type { Universe } from '@/universes/types';
import styles from './UniverseCard.module.css';

interface UniverseCardProps {
  universe: Universe;
  position: number;
}

export function UniverseCard({ universe, position }: UniverseCardProps) {
  const { t } = useTranslation();
  const isAvailable = isUniverseAvailable(universe);

  return (
    <article
      className={cx(styles.card, isAvailable ? styles.available : styles.upcoming)}
      style={{ '--card-accent': universe.accentColor }}
    >
      <span className={styles.index} aria-hidden="true">
        {String(position).padStart(2, '0')}
      </span>
      <h3 className={styles.name}>
        {isAvailable ? (
          // Stretched over the card (see ::after) so the link's name is just the universe name.
          <Link to={getUniversePath(universe.id)} className={styles.link}>
            {universe.name}
          </Link>
        ) : (
          universe.name
        )}
      </h3>
      <p className={styles.tagline}>{t(`universes.${universe.id}.tagline`)}</p>
      {isAvailable ? (
        <span className={styles.footer} aria-hidden="true">
          {t('home.enterUniverse')} <ArrowRightIcon size={18} className={styles.arrow} />
        </span>
      ) : (
        <span className={styles.footer}>{t('home.comingSoon')}</span>
      )}
    </article>
  );
}
