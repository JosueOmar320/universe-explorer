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
import { PokedexHero } from '../components/PokedexHero';
import { PokemonGrid } from '../components/PokemonGrid';
import { PokemonGridSkeleton } from '../components/PokemonGridSkeleton';
import { POKEDEX_PAGE_SIZE, usePokedexPage } from '../hooks/usePokedexPage';
import { UNIVERSE_NAME } from '../paths';
import styles from './PokedexPage.module.css';

export function PokedexPage() {
  const { t, i18n } = useTranslation(['pokemon', 'common']);
  const { page, setPage } = usePageParam();
  const { data, error, fetchStatus, isPending, isError, isFetching, refetch } =
    usePokedexPage(page);
  const { resultsRef, focusResults } = useResultsFocus();

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    focusResults();
  };

  const renderResults = () => {
    if (isPending) {
      return fetchStatus === 'paused' ? <OfflineState /> : <PokemonGridSkeleton />;
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

    if (data.items.length === 0) {
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
        <PokemonGrid entries={data.items} />
        <Pagination
          className={styles.pagination}
          currentPage={page}
          totalPages={data.totalPages}
          onPageChange={handlePageChange}
          label={t('pokedex.paginationLabel')}
        />
      </>
    );
  };

  const getSummary = (): string => {
    if (!data || data.items.length === 0) return '';
    const from = (page - 1) * POKEDEX_PAGE_SIZE + 1;
    const to = from + data.items.length - 1;
    const total = data.totalCount.toLocaleString(i18n.resolvedLanguage);
    return t('pokedex.summary', { from, to, total });
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

      <PokedexHero totalSpecies={data?.totalCount} />

      <section aria-labelledby="pk-results-title" className={styles.results}>
        <header className={styles.resultsHeader}>
          <h2 id="pk-results-title" ref={resultsRef} tabIndex={-1} className={styles.resultsTitle}>
            {t('pokedex.title')}
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
