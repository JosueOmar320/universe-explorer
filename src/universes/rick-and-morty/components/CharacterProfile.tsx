import type { ReactNode } from 'react';
import type { Character, Episode } from '../api/types';
import { formatRecordId } from '../utils/format';
import { ScannerFrame } from './ScannerFrame';
import { StatusBadge } from './StatusBadge';
import styles from './CharacterProfile.module.css';

interface CharacterProfileProps {
  character: Character;
  /** Undefined while episodes are loading. */
  episodes: Episode[] | undefined;
}

function formatEpisode(episode: Episode | undefined): ReactNode {
  if (!episode) return '—';
  return (
    <>
      <span className={styles.code}>{episode.episode}</span> {episode.name}
    </>
  );
}

export function CharacterProfile({ character, episodes }: CharacterProfileProps) {
  const { id, name, image, status, species, type, gender, origin, location } = character;
  const loading = <span className={styles.pending}>Loading…</span>;

  return (
    <section className={styles.profile} aria-labelledby="rm-character-name">
      <div className={styles.portrait}>
        <img
          src={image}
          alt={`Portrait of ${name}`}
          width={300}
          height={300}
          fetchPriority="high"
          className={styles.image}
        />
        <ScannerFrame />
        <span className={styles.status}>
          <StatusBadge status={status} />
        </span>
      </div>

      <div className={styles.info}>
        <p className={styles.recordId}>Record {formatRecordId(id)}</p>
        <h1 id="rm-character-name" className={styles.name}>
          {name}
        </h1>

        <dl className={styles.facts}>
          <Fact label="Gender">{gender}</Fact>
          <Fact label="Species">{type ? `${species} (${type})` : species}</Fact>
          <Fact label="Origin">{origin.name}</Fact>
          <Fact label="Last known location">{location.name}</Fact>
          <Fact label="First seen in">{episodes ? formatEpisode(episodes[0]) : loading}</Fact>
          <Fact label="Appearances">
            {character.episode.length} {character.episode.length === 1 ? 'episode' : 'episodes'}
          </Fact>
        </dl>
      </div>
    </section>
  );
}

function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={styles.fact}>
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}
