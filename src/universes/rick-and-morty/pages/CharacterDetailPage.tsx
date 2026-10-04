import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { isHttpError } from '@/shared/api/httpClient';
import { BackLink } from '@/shared/components/BackLink';
import { ButtonLink } from '@/shared/components/Button';
import { OfflineState } from '@/shared/components/OfflineState';
import { PageTitle } from '@/shared/components/PageTitle';
import { QueryErrorState } from '@/shared/components/QueryErrorState';
import { StatusPanel } from '@/shared/components/StatusPanel';
import { SearchOffIcon } from '@/shared/icons/icons';
import { CharacterDetailSkeleton } from '../components/CharacterDetailSkeleton';
import { CharacterProfile } from '../components/CharacterProfile';
import { EpisodeLog } from '../components/EpisodeLog';
import { EpisodeLogSkeleton } from '../components/EpisodeLogSkeleton';
import { useCharacter } from '../hooks/useCharacter';
import { useEpisodes } from '../hooks/useEpisodes';
import { rickAndMortyPaths, UNIVERSE_NAME } from '../paths';
import styles from './CharacterDetailPage.module.css';

function parseCharacterId(value: string | undefined): number | undefined {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : undefined;
}

export function CharacterDetailPage() {
  const { t } = useTranslation('rickAndMorty');
  const id = parseCharacterId(useParams().characterId);

  return (
    <>
      <BackLink to={rickAndMortyPaths.characters} label={t('detail.back')} />
      {/* Invalid ids never reach the API (it would answer 500, not 404). */}
      {id === undefined ? <CharacterNotFound /> : <CharacterDetail id={id} />}
    </>
  );
}

function CharacterDetail({ id }: { id: number }) {
  const { t } = useTranslation('rickAndMorty');
  const {
    data: character,
    error,
    fetchStatus,
    isPending,
    isError,
    isFetching,
    refetch,
  } = useCharacter(id);
  // Fetched here as well so the profile can show "First seen in" (same cached query).
  const { data: episodes } = useEpisodes(character?.episode);

  if (isPending) {
    return fetchStatus === 'paused' ? (
      <OfflineState headingLevel="h1" />
    ) : (
      <CharacterDetailSkeleton />
    );
  }

  if (isError) {
    if (isHttpError(error, 404)) return <CharacterNotFound />;
    return (
      <QueryErrorState
        error={error}
        onRetry={() => void refetch()}
        isRetrying={isFetching}
        title={t('errors.title')}
        headingLevel="h1"
      />
    );
  }

  return (
    <>
      <PageTitle parts={[character.name, UNIVERSE_NAME]} />

      <CharacterProfile character={character} episodes={episodes} />

      <EpisodesSection episodeUrls={character.episode} />
    </>
  );
}

function EpisodesSection({ episodeUrls }: { episodeUrls: string[] }) {
  const { t } = useTranslation('rickAndMorty');
  const {
    data: episodes,
    error,
    fetchStatus,
    isPending,
    isError,
    isFetching,
    refetch,
  } = useEpisodes(episodeUrls);

  const renderContent = () => {
    if (isPending) {
      return fetchStatus === 'paused' ? <OfflineState /> : <EpisodeLogSkeleton />;
    }
    if (isError) {
      return (
        <QueryErrorState
          error={error}
          onRetry={() => void refetch()}
          isRetrying={isFetching}
          title={t('errors.episodesTitle')}
        />
      );
    }
    return <EpisodeLog episodes={episodes} />;
  };

  return (
    <section aria-labelledby="rm-episodes-title">
      <h2 id="rm-episodes-title" className={styles.sectionTitle}>
        {t('episodes.title')}
      </h2>
      {renderContent()}
    </section>
  );
}

function CharacterNotFound() {
  const { t } = useTranslation('rickAndMorty');

  return (
    <>
      <PageTitle parts={[t('detail.notFoundTitle'), UNIVERSE_NAME]} />
      <StatusPanel
        headingLevel="h1"
        icon={<SearchOffIcon size={24} />}
        title={t('detail.notFoundTitle')}
        description={t('detail.notFoundDescription')}
        actions={<ButtonLink to={rickAndMortyPaths.characters}>{t('detail.browse')}</ButtonLink>}
      />
    </>
  );
}
