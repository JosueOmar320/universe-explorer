import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import fieldStyles from '@/shared/components/Field.module.css';
import { cx } from '@/shared/utils/cx';
import type { Film } from '../api/models';
import { formatEpisode } from '../utils/format';
import styles from './EpisodeFilter.module.css';

interface EpisodeFilterProps {
  films: Film[] | undefined;
  /** Selected episode number, as stored in the URL. */
  value: string | undefined;
  onChange: (episode: string | undefined) => void;
  className?: string;
}

/**
 * Film filter as a radio group (arrow keys, screen reader semantics). Options show the
 * episode numeral; screen readers hear the full title ("Episode IV: A New Hope").
 */
export function EpisodeFilter({ films = [], value, onChange, className }: EpisodeFilterProps) {
  const { t } = useTranslation(['starWars', 'common']);
  const name = useId();

  const options = [
    { value: undefined, short: t('common:filters.all'), label: undefined },
    ...films.map((film) => ({
      value: String(film.episode),
      short: formatEpisode(film.episode),
      label: t('filters.episodeOption', { number: formatEpisode(film.episode), title: film.title }),
    })),
  ];

  return (
    <fieldset className={cx(fieldStyles.field, className)}>
      <legend className={fieldStyles.label}>{t('filters.episode')}</legend>
      <div className={styles.options}>
        {options.map((option) => (
          <label key={option.value ?? 'all'} className={styles.option} title={option.label}>
            <input
              type="radio"
              name={name}
              className={styles.input}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              aria-label={option.label}
            />
            <span className={styles.text}>{option.short}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
