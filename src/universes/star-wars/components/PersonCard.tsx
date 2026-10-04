import { useTranslation } from 'react-i18next';
import type { Person } from '../api/models';
import { HUMAN_SPECIES_ID, useArchive } from '../hooks/useArchive';
import { formatCentimetres, formatKilograms, formatRecordNumber } from '../utils/format';
import { FilmPips } from './FilmPips';
import styles from './PersonCard.module.css';

export function PersonCard({ person }: { person: Person }) {
  const { t, i18n } = useTranslation('starWars');
  const { planetsById, speciesById, films } = useArchive();
  const language = i18n.resolvedLanguage;
  const unknown = t('values.unknown');

  const speciesId = person.speciesIds[0] ?? HUMAN_SPECIES_ID;
  const origin = [
    speciesById?.get(speciesId)?.name,
    person.homeworldId === null ? undefined : planetsById?.get(person.homeworldId)?.name,
  ].filter(Boolean);

  return (
    <article className={styles.card}>
      <div className={styles.top}>
        <span className={styles.record}>
          <span aria-hidden="true">REC·{formatRecordNumber(person.id)}</span>
          <span className="visually-hidden">{t('card.record', { id: person.id })}</span>
        </span>
        {films && <FilmPips films={films} filmIds={person.filmIds} />}
      </div>

      <h3 className={styles.name}>{person.name}</h3>
      <p className={styles.origin}>{origin.join(' · ')}</p>

      <dl className={styles.metrics}>
        <div>
          <dt>{t('card.height')}</dt>
          <dd>
            {person.heightCm === null ? unknown : formatCentimetres(person.heightCm, language)}
          </dd>
        </div>
        <div>
          <dt>{t('card.mass')}</dt>
          <dd>{person.massKg === null ? unknown : formatKilograms(person.massKg, language)}</dd>
        </div>
        <div>
          <dt>{t('card.born')}</dt>
          <dd>{person.birthYear ?? unknown}</dd>
        </div>
      </dl>
    </article>
  );
}
