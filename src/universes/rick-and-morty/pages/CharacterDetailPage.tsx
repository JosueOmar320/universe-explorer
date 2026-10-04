import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { isHttpError } from '@/shared/api/httpClient';
import { Button, ButtonLink } from '@/shared/components/Button';
import { PageTitle } from '@/shared/components/PageTitle';
import { StatusPanel } from '@/shared/components/StatusPanel';
import { AlertIcon, RefreshIcon, SearchOffIcon } from '@/shared/icons/icons';
import { BackToCharactersLink } from '../components/BackToCharactersLink';
import { CharacterDetailSkeleton } from '../components/CharacterDetailSkeleton';
import { CharacterProfile } from '../components/CharacterProfile';
import { EpisodeLog } from '../components/EpisodeLog';
import { useCharacter } from '../hooks/useCharacter';
import { useEpisodes } from '../hooks/useEpisodes';
import { rickAndMortyPaths, UNIVERSE_NAME } from '../paths';
import styles from './CharacterDetailPage.module.css';

function parseCharacterId(value: string | undefined): number | undefined {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : undefined;
}

export function CharacterDetailPage() {
  const id = parseCharacterId(useParams().characterId);

  return (
    <>
      <BackToCharactersLink />
      {/* Invalid ids never reach the API (it would answer 500, not 404). */}
      {id === undefined ? <CharacterNotFound /> : <CharacterDetail id={id} />}
    </>
  );
}

function CharacterDetail({ id }: { id: number }) {
  const { t } = useTranslation(['rickAndMorty', 'common']);
  const { data: character, isPending, isError, error, isFetching, refetch } = useCharacter(id);
  // Fetched here as well so the profile can show "First seen in" (same cached query).
  const { data: episodes } = useEpisodes(character?.episode);

  if (isPending) return <CharacterDetailSkeleton />;

  if (isError) {
    if (isHttpError(error, 404)) return <CharacterNotFound />;
    return (
      <StatusPanel
        tone="danger"
        headingLevel="h1"
        icon={<AlertIcon size={24} />}
        title={t('errors.title')}
        description={t('errors.detailDescription')}
        actions={
          <Button onClick={() => void refetch()} disabled={isFetching}>
            <RefreshIcon size={18} />
            {isFetching ? t('common:actions.retrying') : t('common:actions.retry')}
          </Button>
        }
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
  const { t } = useTranslation(['rickAndMorty', 'common']);
  const { data: episodes, isPending, isError, isFetching, refetch } = useEpisodes(episodeUrls);

  const renderContent = () => {
    if (isPending) {
      return (
        <p className={styles.muted} role="status">
          {t('episodes.loading')}
        </p>
      );
    }
    if (isError) {
      return (
        <StatusPanel
          tone="danger"
          title={t('errors.episodesTitle')}
          description={t('errors.episodesDescription')}
          actions={
            <Button onClick={() => void refetch()} disabled={isFetching}>
              <RefreshIcon size={18} />
              {t('common:actions.retry')}
            </Button>
          }
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
