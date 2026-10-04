import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import type { Character } from '../api/types';
import { useRecordNameTransition } from '@/shared/hooks/useRecordNameTransition';
import { FROM_LIST_STATE } from '@/shared/utils/listNavigation';
import { rickAndMortyPaths } from '../paths';
import { formatRecordId } from '../utils/format';
import { ScannerFrame } from './ScannerFrame';
import { StatusBadge } from './StatusBadge';
import styles from './CharacterCard.module.css';

interface CharacterCardProps {
  character: Character;
  /** Loads the image eagerly for cards likely to be visible on first paint. */
  priority?: boolean;
}

export function CharacterCard({ character, priority = false }: CharacterCardProps) {
  const { t } = useTranslation('rickAndMorty');
  const { id, name, image, status, species, gender, origin, location } = character;
  const href = rickAndMortyPaths.character(id);
  const nameTransition = useRecordNameTransition(href);

  return (
    <article className={styles.card}>
      <div className={styles.media}>
        {/* Decorative: the character name is the card heading right below. */}
        <img
          src={image}
          alt=""
          width={300}
          height={300}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className={styles.image}
        />
        <ScannerFrame corners="hover" />
        <span className={styles.recordId} aria-hidden="true">
          {formatRecordId(id)}
        </span>
        <span className={styles.status}>
          <StatusBadge status={status} />
        </span>
      </div>

      <div className={styles.body}>
        <h3 className={styles.name} style={nameTransition}>
          {/* The link covers the whole card (see ::after) while its accessible name stays short. */}
          <Link to={href} state={FROM_LIST_STATE} viewTransition className={styles.link}>
            {name}
          </Link>
        </h3>
        <dl className={styles.facts}>
          <Fact label={t('fields.species')} value={species} />
          <Fact label={t('fields.gender')} value={gender} />
          <Fact label={t('fields.origin')} value={origin.name} />
          <Fact label={t('fields.lastSeen')} value={location.name} />
        </dl>
      </div>
    </article>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.fact}>
      <dt>{label}</dt>
      <dd title={value}>{value}</dd>
    </div>
  );
}
