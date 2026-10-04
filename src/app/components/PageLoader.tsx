import { useTranslation } from 'react-i18next';
import styles from './PageLoader.module.css';

/** Full-screen loader for the initial load of lazy routes. */
export function PageLoader() {
  const { t } = useTranslation();

  return (
    <div className={styles.loader} role="status">
      <span className={styles.spinner} aria-hidden="true" />
      <span className="visually-hidden">{t('app.loading')}</span>
    </div>
  );
}
