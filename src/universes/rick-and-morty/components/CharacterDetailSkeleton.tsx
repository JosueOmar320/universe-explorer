import { Skeleton } from '@/shared/components/Skeleton';
import styles from './CharacterProfile.module.css';

export function CharacterDetailSkeleton() {
  return (
    <div role="status">
      <span className="visually-hidden">Loading character…</span>
      <div className={styles.profile} aria-hidden="true">
        <Skeleton className={styles.portrait} />
        <div className={styles.info}>
          <Skeleton width="8rem" height="0.75rem" />
          <Skeleton width="70%" height="3.5rem" className={styles.name} />
          <Skeleton width="100%" height="9rem" className={styles.facts} />
        </div>
      </div>
    </div>
  );
}
