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
import { HOGWARTS_HOUSES } from '../api/models';
import { CHARACTERS_PAGE_SIZE } from '../api/potterDb';
import { CharacterGrid } from '../components/CharacterGrid';
import { CharacterGridSkeleton } from '../components/CharacterGridSkeleton';
import { RegistryHero } from '../components/RegistryHero';
import { useCharacters } from '../hooks/useCharacters';
import { UNIVERSE_NAME } from '../paths';
import styles from './CharactersPage.module.css';

export function CharactersPage() {
  const { t, i18n } = useTranslation(['harryPotter', 'common']);
  const { page, setPage } = usePageParam();
  // Hogwarts students by default: the full registry (~5,400 entries) is mostly owls,
  // spectators and one-off mentions.
  const { data, error, fetchStatus, isPending, isError, isFetching, isPlaceholderData, refetch } =
    useCharacters({ page, houses: HOGWARTS_HOUSES });
  const { resultsRef, focusResults } = useResultsFocus();

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    focusResults();
  };

  const renderResults = () => {
    if (isPending) {
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
          title={t('empty.pageTitle')}
          description={t('empty.pageDescription', { page })}
          actions={<Button onClick={() => handlePageChange(1)}>{t('empty.firstPage')}</Button>}
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

  const getSummary = (): string => {
    if (isFetching && !isPending) return t('characters.updating');
    if (!data || data.characters.length === 0) return '';
    const from = (page - 1) * CHARACTERS_PAGE_SIZE + 1;
    const to = from + data.characters.length - 1;
    const total = data.totalCount.toLocaleString(i18n.resolvedLanguage);
    return t('characters.summary', { from, to, total });
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

      <RegistryHero students={data?.totalCount || undefined} />

      <section aria-labelledby="hp-results-title" className={styles.results}>
        <header className={styles.resultsHeader}>
          <h2 id="hp-results-title" ref={resultsRef} tabIndex={-1} className={styles.resultsTitle}>
            {t('characters.title')}
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
