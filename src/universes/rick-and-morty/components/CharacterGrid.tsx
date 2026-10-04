import type { Character } from '../api/types';
import { CharacterCard } from './CharacterCard';
import styles from './CharacterGrid.module.css';

/** Cards rendered eagerly; roughly the first row on desktop. */
const PRIORITY_CARDS = 4;

interface CharacterGridProps {
  characters: Character[];
  /** Dims the grid while a new page replaces it. */
  isUpdating?: boolean;
}

export function CharacterGrid({ characters, isUpdating = false }: CharacterGridProps) {
  return (
    <ul className={styles.grid} data-updating={isUpdating} aria-busy={isUpdating}>
      {characters.map((character, index) => (
        <li key={character.id}>
          <CharacterCard character={character} priority={index < PRIORITY_CARDS} />
        </li>
      ))}
    </ul>
  );
}
