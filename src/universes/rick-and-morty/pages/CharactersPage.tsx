import { useRef } from 'react';
import { Button } from '@/shared/components/Button';
import { Pagination } from '@/shared/components/Pagination';
import { StatusPanel } from '@/shared/components/StatusPanel';
import { usePageParam } from '@/shared/hooks/usePageParam';
import { AlertIcon, RefreshIcon, SearchOffIcon } from '@/shared/icons/icons';
import { CHARACTERS_PAGE_SIZE } from '../api/rickAndMortyApi';
import type { CharacterPage } from '../api/types';
import { CharacterGrid } from '../components/CharacterGrid';
import { CharacterGridSkeleton } from '../components/CharacterGridSkeleton';
import { PortalHero } from '../components/PortalHero';
import { useCharacters } from '../hooks/useCharacters';
import styles from './CharactersPage.module.css';

export function CharactersPage() {
  const { page, setPage } = usePageParam();
  const { data, isPending, isError, isFetching, isPlaceholderData, refetch } = useCharacters({
    page,
  });
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
          title="Nothing in this dimension"
          description={`Page ${page} doesn't contain any characters.`}
          actions={<Button onClick={() => handlePageChange(1)}>Go to first page</Button>}
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

      {/* An out-of-range page returns no total, so fall back to the placeholder. */}
      <PortalHero totalCharacters={data?.totalCount || undefined} />

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
            {getSummary({ page, isPlaceholderData, data })}
          </p>
        </header>

        {renderResults()}
      </section>
    </>
  );
}

function getSummary({
  page,
  isPlaceholderData,
  data,
}: {
  page: number;
  isPlaceholderData: boolean;
  data: CharacterPage | undefined;
}): string {
  if (isPlaceholderData) return `Loading page ${page}…`;
  if (!data || data.characters.length === 0) return '';

  const first = (page - 1) * CHARACTERS_PAGE_SIZE + 1;
  const last = first + data.characters.length - 1;
  return `Showing ${first}–${last} of ${data.totalCount.toLocaleString('en-US')}`;
}
