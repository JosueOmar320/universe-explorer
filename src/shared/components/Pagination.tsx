import { useTranslation } from 'react-i18next';
import { ChevronLeftIcon, ChevronRightIcon } from '@/shared/icons/icons';
import { cx } from '@/shared/utils/cx';
import { getPaginationRange } from '@/shared/utils/pagination';
import styles from './Pagination.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** Accessible name for the navigation landmark (defaults to a generic one). */
  label?: string;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  label,
  className,
}: PaginationProps) {
  const { t } = useTranslation();
  if (totalPages <= 1) return null;

  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  return (
    <nav aria-label={label ?? t('pagination.label')} className={cx(styles.pagination, className)}>
      <button
        type="button"
        className={cx(styles.control, styles.step)}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={isFirstPage}
        aria-label={t('pagination.previous')}
      >
        <ChevronLeftIcon size={18} />
        <span className={styles.stepLabel}>{t('pagination.previousShort')}</span>
      </button>

      <ol className={styles.pages}>
        {getPaginationRange(currentPage, totalPages).map((item) =>
          typeof item === 'number' ? (
            <li key={item}>
              <button
                type="button"
                className={cx(styles.control, item === currentPage && styles.current)}
                onClick={() => onPageChange(item)}
                aria-label={t('pagination.page', { page: item })}
                aria-current={item === currentPage ? 'page' : undefined}
              >
                {item}
              </button>
            </li>
          ) : (
            <li key={item} className={styles.ellipsis} aria-hidden="true">
              …
            </li>
          ),
        )}
      </ol>

      {/* Compact indicator replacing the page list on small screens */}
      <p className={styles.compactStatus}>
        <span aria-hidden="true">
          {t('pagination.compact', { page: currentPage, total: totalPages })}
        </span>
        <span className="visually-hidden">
          {t('pagination.status', { page: currentPage, total: totalPages })}
        </span>
      </p>

      <button
        type="button"
        className={cx(styles.control, styles.step)}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={isLastPage}
        aria-label={t('pagination.next')}
      >
        <span className={styles.stepLabel}>{t('pagination.nextShort')}</span>
        <ChevronRightIcon size={18} />
      </button>
    </nav>
  );
}
