import { cx } from '@/shared/utils/cx';
import type { Character } from '../api/models';
import { CharacterCard } from './CharacterCard';
import styles from './CharacterGrid.module.css';

interface CharacterGridProps {
  characters: Character[];
  /** Dims the grid while the next page replaces it. */
  isUpdating?: boolean;
}

export function CharacterGrid({ characters, isUpdating = false }: CharacterGridProps) {
  return (
    <ul className={cx(styles.grid, isUpdating && styles.updating)} aria-busy={isUpdating}>
      {characters.map((character) => (
        <li key={character.id}>
          <CharacterCard character={character} />
        </li>
      ))}
    </ul>
  );
}
