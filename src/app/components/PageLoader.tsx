import styles from './PageLoader.module.css';

/** Full-screen loader for the initial load of lazy routes. */
export function PageLoader() {
  return (
    <div className={styles.loader} role="status">
      <span className={styles.spinner} aria-hidden="true" />
      <span className="visually-hidden">Loading…</span>
    </div>
  );
}
