import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { type FavoriteInput, toggleFavorite, useIsFavorite } from '@/shared/favorites/favorites';
import { StarIcon } from '@/shared/icons/icons';
import styles from './FavoriteButton.module.css';

/**
 * Star toggle that saves a record to the favorites. It inherits the colour of the heading it
 * sits next to, so it fits every universe's theme (including coloured banners).
 */
export function FavoriteButton({ favorite }: { favorite: FavoriteInput }) {
  const { t } = useTranslation();
  const isFavorite = useIsFavorite(favorite.universe, favorite.id);
  const label = t('favorites.toggle', { name: favorite.name });

  return (
    <button
      type="button"
      className={styles.button}
      aria-pressed={isFavorite}
      aria-label={label}
      title={label}
      onClick={() => toggleFavorite(favorite)}
    >
      <StarIcon size={22} filled={isFavorite} />
    </button>
  );
}

/** A detail page heading with its favorite toggle beside it. */
export function HeadingWithFavorite({
  children,
  favorite,
}: {
  children: ReactNode;
  favorite: FavoriteInput;
}) {
  return (
    <div className={styles.row}>
      {children}
      <FavoriteButton favorite={favorite} />
    </div>
  );
}
