import { Link, Outlet, ScrollRestoration } from 'react-router';
import { UniverseSwitcher } from '@/app/components/UniverseSwitcher';
import { OrbitMarkIcon } from '@/shared/icons/icons';
import { useActiveUniverse } from '@/universes/useActiveUniverse';
import styles from './AppShell.module.css';

/**
 * Global frame shared by every universe. `data-universe` is the theming hook:
 * each universe overrides the design tokens under `[data-universe='<id>']`.
 */
export function AppShell() {
  const activeUniverse = useActiveUniverse();

  return (
    <div className={styles.shell} data-universe={activeUniverse?.id ?? 'hub'}>
      <a href="#main-content" className={styles.skipLink}>
        Skip to content
      </a>

      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link to="/" className={styles.brand}>
            <OrbitMarkIcon size={26} className={styles.brandMark} />
            <span className={styles.brandName}>
              Universe <strong>Explorer</strong>
            </span>
          </Link>
          <UniverseSwitcher />
        </div>
      </header>

      <main id="main-content" tabIndex={-1} className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <p>
          Fan-made portfolio project. Characters and trademarks belong to their respective owners.
        </p>
      </footer>

      <ScrollRestoration />
    </div>
  );
}
