import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { useRecordNameTransition } from '@/shared/hooks/useRecordNameTransition';
import { FROM_LIST_STATE } from '@/shared/utils/listNavigation';
import type { Person } from '../api/models';
import { useArchive } from '../hooks/useArchive';
import { starWarsPaths } from '../paths';
import { formatCentimetres, formatKilograms, formatRecordNumber } from '../utils/format';
import { getSpeciesIds } from '../utils/people';
import { FilmPips } from './FilmPips';
import styles from './PersonCard.module.css';

export function PersonCard({ person }: { person: Person }) {
  const { t, i18n } = useTranslation('starWars');
  const { planetsById, speciesById, films } = useArchive();
  const language = i18n.resolvedLanguage;
  const unknown = t('values.unknown');
  const href = starWarsPaths.person(person.id);
  const nameTransition = useRecordNameTransition(href);

  const [speciesId] = getSpeciesIds(person);
  const origin = [
    speciesId === undefined ? undefined : speciesById?.get(speciesId)?.name,
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

      <h3 className={styles.name} style={nameTransition}>
        {/* Stretched over the card (see ::after); its accessible name is just the name. */}
        <Link to={href} state={FROM_LIST_STATE} viewTransition className={styles.link}>
          {person.name}
        </Link>
      </h3>
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
