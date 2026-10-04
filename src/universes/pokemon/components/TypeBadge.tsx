import type { PokemonType } from '../api/models';
import { useTypeName } from '../hooks/useTypeName';
import styles from './TypeBadge.module.css';

export function TypeBadge({ type }: { type: PokemonType }) {
  const name = useTypeName(type);

  return (
    <span className={styles.badge} data-type={type}>
      {name}
    </span>
  );
}
