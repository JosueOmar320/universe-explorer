import type { Character } from '../api/types';
import { StatusBadge } from './StatusBadge';
import styles from './CharacterCard.module.css';

interface CharacterCardProps {
  character: Character;
  /** Loads the image eagerly for cards likely to be visible on first paint. */
  priority?: boolean;
}

export function CharacterCard({ character, priority = false }: CharacterCardProps) {
  const { id, name, image, status, species, gender, origin, location } = character;

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
        <span className={styles.frame} aria-hidden="true" />
        <span className={styles.recordId} aria-hidden="true">
          #{String(id).padStart(4, '0')}
        </span>
        <span className={styles.status}>
          <StatusBadge status={status} />
        </span>
      </div>

      <div className={styles.body}>
        <h3 className={styles.name}>{name}</h3>
        <dl className={styles.facts}>
          <Fact label="Species" value={species} />
          <Fact label="Gender" value={gender} />
          <Fact label="Origin" value={origin.name} />
          <Fact label="Last seen" value={location.name} />
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
