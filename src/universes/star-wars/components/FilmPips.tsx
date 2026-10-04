import { useTranslation } from 'react-i18next';
import type { Film } from '../api/models';
import { formatEpisode } from '../utils/format';
import styles from './FilmPips.module.css';

interface FilmPipsProps {
  /** All films, in episode order. */
  films: Film[];
  /** Films this person appears in. */
  filmIds: number[];
}

/** One pip per film (I–VI), lit when the person appears in it. */
export function FilmPips({ films, filmIds }: FilmPipsProps) {
  const { t } = useTranslation('starWars');
  const appearsIn = new Set(filmIds);
  const count = films.filter((film) => appearsIn.has(film.id)).length;

  return (
    <span
      className={styles.pips}
      role="img"
      aria-label={t('card.films', { count, total: films.length })}
    >
      {films.map((film) => (
        <span
          key={film.id}
          className={styles.pip}
          data-on={appearsIn.has(film.id)}
          title={`${formatEpisode(film.episode)} · ${film.title}`}
        >
          {formatEpisode(film.episode)}
        </span>
      ))}
    </span>
  );
}
