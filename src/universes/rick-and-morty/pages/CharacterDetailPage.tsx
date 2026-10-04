import { useParams } from 'react-router';
import { isHttpError } from '@/shared/api/httpClient';
import { Button, ButtonLink } from '@/shared/components/Button';
import { StatusPanel } from '@/shared/components/StatusPanel';
import { AlertIcon, RefreshIcon, SearchOffIcon } from '@/shared/icons/icons';
import { BackToCharactersLink } from '../components/BackToCharactersLink';
import { CharacterDetailSkeleton } from '../components/CharacterDetailSkeleton';
import { CharacterProfile } from '../components/CharacterProfile';
import { EpisodeLog } from '../components/EpisodeLog';
import { useCharacter } from '../hooks/useCharacter';
import { useEpisodes } from '../hooks/useEpisodes';
import { rickAndMortyPaths } from '../paths';
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
        title="Portal malfunction"
        description="We couldn't load this character. Check your connection and try again."
        actions={
          <Button onClick={() => void refetch()} disabled={isFetching}>
            <RefreshIcon size={18} />
            {isFetching ? 'Retrying…' : 'Try again'}
          </Button>
        }
      />
    );
  }

  return (
    <>
      <title>{`${character.name} · Rick and Morty · Universe Explorer`}</title>

      <CharacterProfile character={character} episodes={episodes} />

      <EpisodesSection episodeUrls={character.episode} />
    </>
  );
}

function EpisodesSection({ episodeUrls }: { episodeUrls: string[] }) {
  const { data: episodes, isPending, isError, isFetching, refetch } = useEpisodes(episodeUrls);

  const renderContent = () => {
    if (isPending) {
      return (
        <p className={styles.muted} role="status">
          Loading episodes…
        </p>
      );
    }
    if (isError) {
      return (
        <StatusPanel
          tone="danger"
          title="Episodes unavailable"
          description="The episode archive didn't respond."
          actions={
            <Button onClick={() => void refetch()} disabled={isFetching}>
              <RefreshIcon size={18} />
              Try again
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
        Episode log
      </h2>
      {renderContent()}
    </section>
  );
}

function CharacterNotFound() {
  return (
    <>
      <title>Character not found · Rick and Morty · Universe Explorer</title>
      <StatusPanel
        headingLevel="h1"
        icon={<SearchOffIcon size={24} />}
        title="Character not found"
        description="No record with this id exists in any known dimension."
        actions={<ButtonLink to={rickAndMortyPaths.characters}>Browse characters</ButtonLink>}
      />
    </>
  );
}
