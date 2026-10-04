import { ChevronLeftIcon, ChevronRightIcon } from '@/shared/icons/icons';
import { cx } from '@/shared/utils/cx';
import { getPaginationRange } from '@/shared/utils/pagination';
import styles from './Pagination.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** Accessible name for the navigation landmark. */
  label?: string;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  label = 'Pagination',
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  return (
    <nav aria-label={label} className={cx(styles.pagination, className)}>
      <button
        type="button"
        className={cx(styles.control, styles.step)}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={isFirstPage}
        aria-label="Previous page"
      >
        <ChevronLeftIcon size={18} />
        <span className={styles.stepLabel}>Prev</span>
      </button>

      <ol className={styles.pages}>
        {getPaginationRange(currentPage, totalPages).map((item) =>
          typeof item === 'number' ? (
            <li key={item}>
              <button
                type="button"
                className={cx(styles.control, item === currentPage && styles.current)}
                onClick={() => onPageChange(item)}
                aria-label={`Page ${item}`}
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
        Page {currentPage} <span aria-hidden="true">/</span>
        <span className="visually-hidden">of</span> {totalPages}
      </p>

      <button
        type="button"
        className={cx(styles.control, styles.step)}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={isLastPage}
        aria-label="Next page"
      >
        <span className={styles.stepLabel}>Next</span>
        <ChevronRightIcon size={18} />
      </button>
    </nav>
  );
}
