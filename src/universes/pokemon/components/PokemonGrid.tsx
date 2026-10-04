import type { PokedexEntry } from '../api/models';
import { usePokedexTypes } from '../hooks/usePokedexTypes';
import { PokemonCard } from './PokemonCard';
import styles from './PokemonGrid.module.css';

/** Roughly the first row on desktop. */
const PRIORITY_CARDS = 4;

export function PokemonGrid({ entries }: { entries: PokedexEntry[] }) {
  const typesById = usePokedexTypes();

  return (
    <ul className={styles.grid}>
      {entries.map((entry, index) => (
        <li key={entry.id}>
          <PokemonCard
            entry={entry}
            // Once loaded, a species missing from every list (a failed request) has no types.
            types={typesById && (typesById.get(entry.id) ?? [])}
            priority={index < PRIORITY_CARDS}
          />
        </li>
      ))}
    </ul>
  );
}
