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
import { CHARACTERS_PAGE_SIZE } from '../api/rickAndMortyApi';
import type { CharacterPage } from '../api/types';
import { CharacterFilters } from '../components/CharacterFilters';
import { CharacterGrid } from '../components/CharacterGrid';
import { CharacterGridSkeleton } from '../components/CharacterGridSkeleton';
import { PortalHero } from '../components/PortalHero';
import { useCharacterFilters } from '../hooks/useCharacterFilters';
import { useCharacters } from '../hooks/useCharacters';
import { useCharacterTotal } from '../hooks/useCharacterTotal';
import { UNIVERSE_NAME } from '../paths';
import styles from './CharactersPage.module.css';

export function CharactersPage() {
  const { t } = useTranslation(['rickAndMorty', 'common']);
  const { page, setPage } = usePageParam();
  const { filters, activeFilterCount, setFilter, clearFilters } = useCharacterFilters();
  const hasFilters = activeFilterCount > 0;
  const { data, error, fetchStatus, isPending, isError, isFetching, isPlaceholderData, refetch } =
    useCharacters({
      page,
      ...filters,
    });
  const totalCharacters = useCharacterTotal();
  const { resultsRef, focusResults } = useResultsFocus();

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    focusResults();
  };

  const renderResults = () => {
    if (isPending) {
      // Offline: the query is paused (not failed) and resumes on reconnect.
      return fetchStatus === 'paused' ? <OfflineState /> : <CharacterGridSkeleton />;
    }

    if (isError) {
      return (
        <QueryErrorState
          error={error}
          onRetry={() => void refetch()}
          isRetrying={isFetching}
          title={t('errors.title')}
        />
      );
    }

    if (data.characters.length === 0) {
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
        <CharacterGrid characters={data.characters} isUpdating={isPlaceholderData} />
        <Pagination
          className={styles.pagination}
          currentPage={page}
          totalPages={data.totalPages}
          onPageChange={handlePageChange}
          label={t('characters.paginationLabel')}
        />
      </>
    );
  };

  return (
    <>
      <PageTitle
        parts={[
          t('characters.title'),
          ...(page > 1 ? [t('common:pagination.page', { page })] : []),
          UNIVERSE_NAME,
        ]}
      />

      <PortalHero totalCharacters={totalCharacters} />

      <section aria-labelledby="rm-results-title" className={styles.results}>
        <header className={styles.resultsHeader}>
          <h2 id="rm-results-title" ref={resultsRef} tabIndex={-1} className={styles.resultsTitle}>
            {t('characters.title')}
          </h2>
          <ResultsSummary
            page={page}
            hasFilters={hasFilters}
            // New page/filters loading, or a background refresh of cached data.
            isUpdating={isFetching && !isPending}
            data={data}
          />
        </header>

        <CharacterFilters
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

interface ResultsSummaryProps {
  page: number;
  hasFilters: boolean;
  isUpdating: boolean;
  data: CharacterPage | undefined;
}

/** Live region: screen readers hear the new range after paging or filtering. */
function ResultsSummary({ page, hasFilters, isUpdating, data }: ResultsSummaryProps) {
  const { t, i18n } = useTranslation('rickAndMorty');

  const getText = (): string => {
    if (isUpdating) return t('characters.updating');
    if (!data) return '';
    if (data.characters.length === 0) return hasFilters ? t('characters.noMatches') : '';

    const from = (page - 1) * CHARACTERS_PAGE_SIZE + 1;
    const to = from + data.characters.length - 1;
    const total = data.totalCount.toLocaleString(i18n.resolvedLanguage);
    return hasFilters
      ? t('characters.summaryFiltered', { from, to, total, count: data.totalCount })
      : t('characters.summary', { from, to, total });
  };

  return (
    <p className={styles.summary} aria-live="polite">
      {getText()}
    </p>
  );
}
