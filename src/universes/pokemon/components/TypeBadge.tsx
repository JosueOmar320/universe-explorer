import type { PokemonType } from '../api/models';
import { useTypeName } from '../hooks/useTypeName';
import { typeColorVars } from '../utils/typeColors';
import styles from './TypeBadge.module.css';

export function TypeBadge({ type }: { type: PokemonType }) {
  const name = useTypeName(type);

  return (
    <span className={styles.badge} style={typeColorVars(type)}>
      {name}
    </span>
  );
}
