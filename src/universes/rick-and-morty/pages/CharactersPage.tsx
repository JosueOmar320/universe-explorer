import { useRef } from 'react';
import { Button } from '@/shared/components/Button';
import { Pagination } from '@/shared/components/Pagination';
import { StatusPanel } from '@/shared/components/StatusPanel';
import { usePageParam } from '@/shared/hooks/usePageParam';
import { AlertIcon, RefreshIcon, SearchOffIcon } from '@/shared/icons/icons';
import { CHARACTERS_PAGE_SIZE } from '../api/rickAndMortyApi';
import type { CharacterPage } from '../api/types';
import { CharacterFilters } from '../components/CharacterFilters';
import { CharacterGrid } from '../components/CharacterGrid';
import { CharacterGridSkeleton } from '../components/CharacterGridSkeleton';
import { PortalHero } from '../components/PortalHero';
import { useCharacterFilters } from '../hooks/useCharacterFilters';
import { useCharacters } from '../hooks/useCharacters';
import { useCharacterTotal } from '../hooks/useCharacterTotal';
import styles from './CharactersPage.module.css';

export function CharactersPage() {
  const { page, setPage } = usePageParam();
  const { filters, activeFilterCount, setFilter, clearFilters } = useCharacterFilters();
  const hasFilters = activeFilterCount > 0;
  const { data, isPending, isError, isFetching, isPlaceholderData, refetch } = useCharacters({
    page,
    ...filters,
  });
  const totalCharacters = useCharacterTotal();
  const resultsHeadingRef = useRef<HTMLHeadingElement>(null);

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    // Bring the new results into view and move focus there for keyboard/screen reader users.
    const heading = resultsHeadingRef.current;
    heading?.focus({ preventScroll: true });
    heading?.scrollIntoView({ block: 'start' });
  };

  const renderResults = () => {
    if (isPending) return <CharacterGridSkeleton />;

    if (isError) {
      return (
        <StatusPanel
          tone="danger"
          icon={<AlertIcon size={24} />}
          title="Portal malfunction"
          description="We couldn't reach the Rick and Morty API. Check your connection and try again."
          actions={
            <Button onClick={() => void refetch()} disabled={isFetching}>
              <RefreshIcon size={18} />
              {isFetching ? 'Retrying…' : 'Try again'}
            </Button>
          }
        />
      );
    }

    if (data.characters.length === 0) {
      return (
        <StatusPanel
          icon={<SearchOffIcon size={24} />}
          title={hasFilters ? 'No matches in this dimension' : 'Nothing in this dimension'}
          description={
            hasFilters
              ? 'No characters match your search and filters. Try something broader.'
              : `Page ${page} doesn't contain any characters.`
          }
          actions={
            <>
              {hasFilters && <Button onClick={clearFilters}>Clear filters</Button>}
              {page > 1 && (
                <Button
                  variant={hasFilters ? 'secondary' : 'primary'}
                  onClick={() => handlePageChange(1)}
                >
                  Go to first page
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
          label="Characters pagination"
        />
      </>
    );
  };

  return (
    <>
      <title>
        {page > 1
          ? `Characters · Page ${page} · Rick and Morty · Universe Explorer`
          : 'Characters · Rick and Morty · Universe Explorer'}
      </title>

      <PortalHero totalCharacters={totalCharacters} />

      <section aria-labelledby="rm-results-title" className={styles.results}>
        <header className={styles.resultsHeader}>
          <h2
            id="rm-results-title"
            ref={resultsHeadingRef}
            tabIndex={-1}
            className={styles.resultsTitle}
          >
            Characters
          </h2>
          <p className={styles.summary} aria-live="polite">
            {getSummary({ page, hasFilters, isPlaceholderData, data })}
          </p>
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

function getSummary({
  page,
  hasFilters,
  isPlaceholderData,
  data,
}: {
  page: number;
  hasFilters: boolean;
  isPlaceholderData: boolean;
  data: CharacterPage | undefined;
}): string {
  if (isPlaceholderData) return 'Updating results…';
  if (!data) return '';
  if (data.characters.length === 0) return hasFilters ? 'No matches' : '';

  const first = (page - 1) * CHARACTERS_PAGE_SIZE + 1;
  const last = first + data.characters.length - 1;
  const total = data.totalCount.toLocaleString('en-US');
  if (!hasFilters) return `Showing ${first}–${last} of ${total}`;
  return `Showing ${first}–${last} of ${total} ${data.totalCount === 1 ? 'match' : 'matches'}`;
}
