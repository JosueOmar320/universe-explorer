import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';
import { useFavorites } from '@/shared/favorites/favorites';
import { StarIcon } from '@/shared/icons/icons';
import styles from './FavoritesLink.module.css';

/** Header link to the favorites page, with how many are saved. */
export function FavoritesLink() {
  const { t } = useTranslation();
  const count = useFavorites().length;

  return (
    <NavLink to="/favorites" className={styles.link} aria-label={t('favorites.link', { count })}>
      <StarIcon size={18} filled={count > 0} />
      {count > 0 && (
        <span className={styles.count} aria-hidden="true">
          {count}
        </span>
      )}
    </NavLink>
  );
}
