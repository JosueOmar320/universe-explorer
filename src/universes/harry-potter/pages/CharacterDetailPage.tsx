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
import { CharacterFile } from '../components/CharacterFile';
import { CharacterFileSkeleton } from '../components/CharacterFileSkeleton';
import { useCharacter } from '../hooks/useCharacter';
import { harryPotterPaths, UNIVERSE_NAME } from '../paths';

/** PotterDB slugs: lowercase words joined by hyphens (e.g. "harry-potter"). */
function parseSlug(value: string | undefined): string | undefined {
  return value && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) ? value : undefined;
}

export function CharacterDetailPage() {
  const { t } = useTranslation('harryPotter');
  const slug = parseSlug(useParams().slug);

  return (
    <>
      <BackLink to={harryPotterPaths.characters} label={t('detail.back')} />
      {/* Malformed slugs never reach the API. */}
      {slug === undefined ? <CharacterNotFound /> : <CharacterDetail key={slug} slug={slug} />}
    </>
  );
}

function CharacterDetail({ slug }: { slug: string }) {
  const { t } = useTranslation('harryPotter');
  const {
    data: character,
    error,
    fetchStatus,
    isPending,
    isError,
    isFetching,
    refetch,
  } = useCharacter(slug);

  if (isPending) {
    return fetchStatus === 'paused' ? (
      <OfflineState headingLevel="h1" />
    ) : (
      <CharacterFileSkeleton />
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
      <CharacterFile character={character} />
    </>
  );
}

function CharacterNotFound() {
  const { t } = useTranslation('harryPotter');

  return (
    <>
      <PageTitle parts={[t('detail.notFoundTitle'), UNIVERSE_NAME]} />
      <StatusPanel
        headingLevel="h1"
        icon={<SearchOffIcon size={24} />}
        title={t('detail.notFoundTitle')}
        description={t('detail.notFoundDescription')}
        actions={<ButtonLink to={harryPotterPaths.characters}>{t('detail.browse')}</ButtonLink>}
      />
    </>
  );
}
