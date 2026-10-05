import { type CSSProperties, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Button, ButtonLink } from '@/shared/components/Button';
import { PageTitle } from '@/shared/components/PageTitle';
import { StatusPanel } from '@/shared/components/StatusPanel';
import {
  clearFavorites,
  type Favorite,
  removeFavorite,
  useFavorites,
} from '@/shared/favorites/favorites';
import { CloseIcon, StarIcon } from '@/shared/icons/icons';
import { isUniverseAvailable, UNIVERSES } from '@/universes/registry';
import styles from './FavoritesPage.module.css';

const keyOf = ({ universe, id }: Favorite) => `${universe}:${id}`;

/** Every saved record, grouped by universe (registry order), newest first. */
export function FavoritesPage() {
  const { t } = useTranslation();
  const favorites = useFavorites();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const clearRef = useRef<HTMLButtonElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [announcement, setAnnouncement] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);

  const groups = UNIVERSES.filter(isUniverseAvailable)
    .map((universe) => ({
      universe,
      items: favorites
        .filter((favorite) => favorite.universe === universe.id)
        .sort((a, b) => b.savedAt - a.savedAt),
    }))
    .filter(({ items }) => items.length > 0);
  const ordered = groups.flatMap(({ items }) => items);

  // The question replaces "Clear all" and takes the focus with it; cancelling gives it back.
  const wasConfirming = useRef(false);
  useEffect(() => {
    if (isConfirming) cancelRef.current?.focus();
    else if (wasConfirming.current) clearRef.current?.focus();
    wasConfirming.current = isConfirming;
  }, [isConfirming]);

  // A removed item takes its button with it: focus moves to the next item's (or the previous
  // one's), or to the heading when the list is gone. flushSync applies the removal to the DOM
  // first, so the target exists (or is gone) by the time focus moves.
  const handleRemove = (favorite: Favorite) => {
    const index = ordered.findIndex((item) => keyOf(item) === keyOf(favorite));
    const next = ordered[index + 1] ?? ordered[index - 1];
    flushSync(() => {
      removeFavorite(favorite.universe, favorite.id);
      setAnnouncement(t('favorites.removed', { name: favorite.name }));
    });
    const target = next
      ? document.querySelector<HTMLElement>(`[data-favorite="${CSS.escape(keyOf(next))}"]`)
      : null;
    (target ?? headingRef.current)?.focus();
  };

  const handleClear = () => {
    flushSync(() => {
      clearFavorites();
      setIsConfirming(false);
      setAnnouncement(t('favorites.cleared'));
    });
    headingRef.current?.focus();
  };

  return (
    <>
      <PageTitle parts={[t('favorites.title')]} />

      <header className={styles.header}>
        <div>
          <h1 ref={headingRef} tabIndex={-1} className={styles.title}>
            {t('favorites.title')}
          </h1>
          <p className={styles.lead}>{t('favorites.lead')}</p>
        </div>

        {ordered.length > 0 &&
          (isConfirming ? (
            <div className={styles.confirm} role="group" aria-labelledby="favorites-confirm">
              <p id="favorites-confirm">{t('favorites.clearConfirm', { count: ordered.length })}</p>
              <Button onClick={handleClear}>{t('favorites.confirm')}</Button>
              <Button ref={cancelRef} variant="secondary" onClick={() => setIsConfirming(false)}>
                {t('favorites.cancel')}
              </Button>
            </div>
          ) : (
            <Button ref={clearRef} variant="secondary" onClick={() => setIsConfirming(true)}>
              {t('favorites.clear')}
            </Button>
          ))}
      </header>

      <p role="status" className="visually-hidden">
        {announcement}
      </p>

      {groups.length === 0 ? (
        <StatusPanel
          icon={<StarIcon size={24} />}
          title={t('favorites.empty.title')}
          description={t('favorites.empty.description')}
          actions={<ButtonLink to="/">{t('favorites.empty.action')}</ButtonLink>}
        />
      ) : (
        <>
          <p className={styles.count}>{t('favorites.count', { count: ordered.length })}</p>
          {groups.map(({ universe, items }) => (
            <section
              key={universe.id}
              aria-labelledby={`favorites-${universe.id}`}
              className={styles.group}
              style={{ '--universe-accent': universe.accentColor } as CSSProperties}
            >
              <h2 id={`favorites-${universe.id}`} className={styles.groupTitle}>
                {universe.name}
              </h2>
              <ul className={styles.list}>
                {items.map((favorite) => (
                  <li key={favorite.id} className={styles.item}>
                    <Link to={favorite.href} className={styles.name}>
                      {favorite.name}
                    </Link>
                    {favorite.detail && <span className={styles.detail}>{favorite.detail}</span>}
                    <button
                      type="button"
                      className={styles.remove}
                      data-favorite={keyOf(favorite)}
                      aria-label={t('favorites.remove', { name: favorite.name })}
                      onClick={() => handleRemove(favorite)}
                    >
                      <CloseIcon size={16} />
                      <span aria-hidden="true">{t('favorites.removeShort')}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </>
      )}
    </>
  );
}
