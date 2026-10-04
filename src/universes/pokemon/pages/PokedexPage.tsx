import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/components/Button';
import { OfflineState } from '@/shared/components/OfflineState';
import { PageTitle } from '@/shared/components/PageTitle';
import { Pagination } from '@/shared/components/Pagination';
import { QueryErrorState } from '@/shared/components/QueryErrorState';
import { StatusPanel } from '@/shared/components/StatusPanel';
import { usePageParam } from '@/shared/hooks/usePageParam';
import { useResultsFocus } from '@/shared/hooks/useResultsFocus';
import { SearchOffIcon } from '@/shared/icons/icons';
import { cx } from '@/shared/utils/cx';
import { PokedexHero } from '../components/PokedexHero';
import { PokemonFilters } from '../components/PokemonFilters';
import { PokemonGrid } from '../components/PokemonGrid';
import { PokemonGridSkeleton } from '../components/PokemonGridSkeleton';
import { POKEDEX_PAGE_SIZE, usePokedexResults } from '../hooks/usePokedexResults';
import { usePokemonFilters } from '../hooks/usePokemonFilters';
import { UNIVERSE_NAME } from '../paths';
import styles from './PokedexPage.module.css';

export function PokedexPage() {
  const { t, i18n } = useTranslation(['pokemon', 'common']);
  const { page, setPage } = usePageParam();
  const { filters, activeFilterCount, setFilter, clearFilters } = usePokemonFilters();
  const hasFilters = activeFilterCount > 0;
  const { results, totalSpecies, isPending, isPaused, error, isRetrying, retry, isUpdating } =
    usePokedexResults({ page, ...filters });
  const { resultsRef, focusResults } = useResultsFocus();

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    focusResults();
  };

  const renderResults = () => {
    if (isPending) return isPaused ? <OfflineState /> : <PokemonGridSkeleton />;

    if (!results) {
      return (
        <QueryErrorState
          error={error}
          onRetry={retry}
          isRetrying={isRetrying}
          title={t('errors.title')}
        />
      );
    }

    if (results.items.length === 0) {
      return (
        <StatusPanel
          icon={<SearchOffIcon size={24} />}
          title={hasFilters ? t('empty.filteredTitle') : t('empty.pageTitle')}
          description={
            hasFilters ? t('empty.filteredDescription') : t('empty.pageDescription', { page })
          }
          actions={
            <>
              {hasFilters && <Button onClick={clearFilters}>{t('empty.clearFilters')}</Button>}
              {page > 1 && (
                <Button
                  variant={hasFilters ? 'secondary' : 'primary'}
                  onClick={() => handlePageChange(1)}
                >
                  {t('empty.firstPage')}
                </Button>
              )}
            </>
          }
        />
      );
    }

    return (
      <>
        <div className={cx(styles.grid, isUpdating && styles.updating)} aria-busy={isUpdating}>
          <PokemonGrid entries={results.items} />
        </div>
        <Pagination
          className={styles.pagination}
          currentPage={page}
          totalPages={results.totalPages}
          onPageChange={handlePageChange}
          label={t('pokedex.paginationLabel')}
        />
      </>
    );
  };

  const getSummary = (): string => {
    if (isUpdating) return t('pokedex.updating');
    if (!results) return '';
    if (results.items.length === 0) return hasFilters ? t('pokedex.noMatches') : '';

    const from = (page - 1) * POKEDEX_PAGE_SIZE + 1;
    const to = from + results.items.length - 1;
    const total = results.totalCount.toLocaleString(i18n.resolvedLanguage);
    return hasFilters
      ? t('pokedex.summaryFiltered', { from, to, total, count: results.totalCount })
      : t('pokedex.summary', { from, to, total });
  };

  return (
    <>
      <PageTitle
        parts={[
          t('pokedex.title'),
          ...(page > 1 ? [t('common:pagination.page', { page })] : []),
          UNIVERSE_NAME,
        ]}
      />

      <PokedexHero totalSpecies={totalSpecies} />

      <section aria-labelledby="pk-results-title" className={styles.results}>
        <header className={styles.resultsHeader}>
          <h2 id="pk-results-title" ref={resultsRef} tabIndex={-1} className={styles.resultsTitle}>
            {t('pokedex.title')}
          </h2>
          <p className={styles.summary} aria-live="polite">
            {getSummary()}
          </p>
        </header>

        <PokemonFilters
          filters={filters}
          activeFilterCount={activeFilterCount}
          onFilterChange={setFilter}
          onClear={clearFilters}
        />

        {renderResults()}
      </section>
    </>
  );
}
