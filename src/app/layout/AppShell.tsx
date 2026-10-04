import { useTranslation } from 'react-i18next';
import { Link, Outlet, ScrollRestoration, useNavigation } from 'react-router';
import { LanguageSwitcher } from '@/app/components/LanguageSwitcher';
import { UniverseSwitcher } from '@/app/components/UniverseSwitcher';
import { OrbitMarkIcon } from '@/shared/icons/icons';
import { useActiveUniverse } from '@/universes/useActiveUniverse';
import styles from './AppShell.module.css';

/**
 * Global frame shared by every universe. `data-universe` is the theming hook:
 * each universe overrides the design tokens under `[data-universe='<id>']`.
 */
export function AppShell() {
  const { t } = useTranslation();
  const activeUniverse = useActiveUniverse();
  const isNavigating = useNavigation().state === 'loading';

  return (
    <div className={styles.shell} data-universe={activeUniverse?.id ?? 'hub'}>
      <a href="#main-content" className={styles.skipLink}>
        {t('app.skipToContent')}
      </a>

      <header className={styles.header}>
        <div className={styles.progress} data-active={isNavigating} aria-hidden="true" />
        <div className={styles.headerInner}>
          <Link to="/" className={styles.brand} aria-label={t('app.home')}>
            <OrbitMarkIcon size={26} className={styles.brandMark} />
            <span className={styles.brandName}>
              Universe <strong>Explorer</strong>
            </span>
          </Link>
          <UniverseSwitcher />
          <LanguageSwitcher />
        </div>
      </header>

      <main id="main-content" tabIndex={-1} className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <p>{t('app.footer')}</p>
      </footer>

      <ScrollRestoration />
    </div>
  );
}
