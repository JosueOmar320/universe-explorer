import type { CharacterStatus } from '../api/types';
import styles from './StatusBadge.module.css';

const STATUS_LABELS: Record<CharacterStatus, string> = {
  Alive: 'Alive',
  Dead: 'Dead',
  unknown: 'Unknown',
};

/** Status is conveyed by text, not only colour. */
export function StatusBadge({ status }: { status: CharacterStatus }) {
  return (
    <span className={styles.badge} data-status={status}>
      <span className={styles.indicator} aria-hidden="true" />
      {STATUS_LABELS[status]}
    </span>
  );
}
