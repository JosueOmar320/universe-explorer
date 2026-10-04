import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SearchIcon } from '@/shared/icons/icons';
import styles from './SearchButton.module.css';

// The palette and every universe's search code load on first use (or when the pointer or
// focus reaches the button), keeping them out of the main bundle.
const loadPalette = () => import('./CommandPalette');
const CommandPalette = lazy(async () => ({ default: (await loadPalette()).CommandPalette }));

const isApplePlatform = () => /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);

/** Opens the global search, from the header or with ⌘K / Ctrl+K anywhere. */
export function SearchButton() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const open = useCallback(() => {
    if (isOpen) return;
    // Where focus goes back to if the search is dismissed.
    if (document.activeElement instanceof HTMLElement) {
      returnFocusRef.current = document.activeElement;
    }
    setIsOpen(true);
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== 'k' || !(event.metaKey || event.ctrlKey)) return;
      event.preventDefault();
      open();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  const handleClose = (navigated: boolean) => {
    setIsOpen(false);
    // After opening a result, focus goes to the new page's content instead.
    if (!navigated) returnFocusRef.current?.focus();
  };

  return (
    <>
      <button
        type="button"
        className={styles.button}
        onClick={open}
        onPointerEnter={() => void loadPalette()}
        onFocus={() => void loadPalette()}
        aria-keyshortcuts="Meta+K Control+K"
        aria-haspopup="dialog"
      >
        <SearchIcon size={18} />
        <span className={styles.label}>{t('search.open')}</span>
        <kbd className={styles.shortcut} aria-hidden="true">
          {isApplePlatform() ? '⌘K' : 'Ctrl K'}
        </kbd>
      </button>

      {isOpen && (
        <Suspense fallback={null}>
          <CommandPalette onClose={handleClose} />
        </Suspense>
      )}
    </>
  );
}
