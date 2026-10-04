import type { PokedexEntry } from '../api/models';
import { PokemonCard } from './PokemonCard';
import styles from './PokemonGrid.module.css';

/** Roughly the first row on desktop. */
const PRIORITY_CARDS = 4;

export function PokemonGrid({ entries }: { entries: PokedexEntry[] }) {
  return (
    <ul className={styles.grid}>
      {entries.map((entry, index) => (
        <li key={entry.id}>
          <PokemonCard entry={entry} priority={index < PRIORITY_CARDS} />
        </li>
      ))}
    </ul>
  );
}
