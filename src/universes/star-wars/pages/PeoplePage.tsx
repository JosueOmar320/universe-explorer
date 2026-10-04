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
import { HoloHero } from '../components/HoloHero';
import { PeopleGrid } from '../components/PeopleGrid';
import { PeopleGridSkeleton } from '../components/PeopleGridSkeleton';
import { useArchive } from '../hooks/useArchive';
import { PEOPLE_PAGE_SIZE, usePeopleResults } from '../hooks/usePeopleResults';
import { UNIVERSE_NAME } from '../paths';
import styles from './PeoplePage.module.css';

export function PeoplePage() {
  const { t, i18n } = useTranslation(['starWars', 'common']);
  const { page, setPage } = usePageParam();
  const { results, totalPeople, isPending, isPaused, error, isRetrying, retry } = usePeopleResults({
    page,
  });
  const { planetsById, speciesById, films } = useArchive();
  const { resultsRef, focusResults } = useResultsFocus();

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    focusResults();
  };

  const renderResults = () => {
    if (isPending) return isPaused ? <OfflineState /> : <PeopleGridSkeleton />;

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
          title={t('empty.pageTitle')}
          description={t('empty.pageDescription', { page })}
          actions={<Button onClick={() => handlePageChange(1)}>{t('empty.firstPage')}</Button>}
        />
      );
    }

    return (
      <>
        <PeopleGrid people={results.items} />
        <Pagination
          className={styles.pagination}
          currentPage={page}
          totalPages={results.totalPages}
          onPageChange={handlePageChange}
          label={t('people.paginationLabel')}
        />
      </>
    );
  };

  const getSummary = (): string => {
    if (!results || results.items.length === 0) return '';
    const from = (page - 1) * PEOPLE_PAGE_SIZE + 1;
    const to = from + results.items.length - 1;
    const total = results.totalCount.toLocaleString(i18n.resolvedLanguage);
    return t('people.summary', { from, to, total });
  };

  return (
    <>
      <PageTitle
        parts={[
          t('people.title'),
          ...(page > 1 ? [t('common:pagination.page', { page })] : []),
          UNIVERSE_NAME,
        ]}
      />

      <HoloHero
        people={totalPeople}
        worlds={planetsById?.size}
        species={speciesById?.size}
        films={films?.length}
      />

      <section aria-labelledby="sw-results-title" className={styles.results}>
        <header className={styles.resultsHeader}>
          <h2 id="sw-results-title" ref={resultsRef} tabIndex={-1} className={styles.resultsTitle}>
            {t('people.title')}
          </h2>
          <p className={styles.summary} aria-live="polite">
            {getSummary()}
          </p>
        </header>

        {renderResults()}
      </section>
    </>
  );
}
