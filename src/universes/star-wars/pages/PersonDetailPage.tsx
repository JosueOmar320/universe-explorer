import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { BackLink } from '@/shared/components/BackLink';
import { ButtonLink } from '@/shared/components/Button';
import { OfflineState } from '@/shared/components/OfflineState';
import { PageTitle } from '@/shared/components/PageTitle';
import { QueryErrorState } from '@/shared/components/QueryErrorState';
import { StatusPanel } from '@/shared/components/StatusPanel';
import { SearchOffIcon } from '@/shared/icons/icons';
import { peopleQueryOptions } from '../api/queries';
import { PersonDetailSkeleton } from '../components/PersonDetailSkeleton';
import { PersonDossier } from '../components/PersonDossier';
import { starWarsPaths, UNIVERSE_NAME } from '../paths';

function parseRecordNumber(value: string | undefined): number | undefined {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : undefined;
}

export function PersonDetailPage() {
  const { t } = useTranslation('starWars');
  const id = parseRecordNumber(useParams().personId);

  return (
    <>
      <BackLink to={starWarsPaths.people} label={t('detail.back')} />
      {id === undefined ? <PersonNotFound /> : <PersonDetail key={id} id={id} />}
    </>
  );
}

function PersonDetail({ id }: { id: number }) {
  const { t } = useTranslation('starWars');
  // The whole collection is already cached by the listing, so this is usually instant.
  const {
    data: person,
    error,
    fetchStatus,
    isPending,
    isError,
    isFetching,
    refetch,
  } = useQuery({
    ...peopleQueryOptions(),
    select: (people) => people.find((candidate) => candidate.id === id) ?? null,
  });

  if (isPending) {
    return fetchStatus === 'paused' ? <OfflineState headingLevel="h1" /> : <PersonDetailSkeleton />;
  }

  if (isError) {
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

  if (person === null) return <PersonNotFound />;

  return (
    <>
      <PageTitle parts={[person.name, UNIVERSE_NAME]} />
      <PersonDossier person={person} />
    </>
  );
}

function PersonNotFound() {
  const { t } = useTranslation('starWars');

  return (
    <>
      <PageTitle parts={[t('detail.notFoundTitle'), UNIVERSE_NAME]} />
      <StatusPanel
        headingLevel="h1"
        icon={<SearchOffIcon size={24} />}
        title={t('detail.notFoundTitle')}
        description={t('detail.notFoundDescription')}
        actions={<ButtonLink to={starWarsPaths.people}>{t('detail.browse')}</ButtonLink>}
      />
    </>
  );
}
