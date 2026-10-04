import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';
import { cx } from '@/shared/utils/cx';
import { getUniversePath, isUniverseAvailable, UNIVERSES } from '@/universes/registry';
import styles from './UniverseSwitcher.module.css';

/** Compact universe navigation rendered in the global header. */
export function UniverseSwitcher() {
  const { t } = useTranslation();

  return (
    <nav aria-label={t('nav.universes')} className={styles.switcher}>
      <ul className={styles.list}>
        {UNIVERSES.map((universe) => (
          <li key={universe.id} style={{ '--item-accent': universe.accentColor }}>
            {isUniverseAvailable(universe) ? (
              <NavLink
                to={getUniversePath(universe.id)}
                className={({ isActive }) => cx(styles.item, isActive && styles.active)}
              >
                <span className={styles.dot} aria-hidden="true" />
                {universe.name}
              </NavLink>
            ) : (
              <span className={cx(styles.item, styles.disabled)}>
                <span className={styles.dot} aria-hidden="true" />
                {universe.name}
                <span className={styles.soonBadge} aria-hidden="true">
                  {t('nav.soon')}
                </span>
                <span className="visually-hidden">{t('nav.comingSoon')}</span>
              </span>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
