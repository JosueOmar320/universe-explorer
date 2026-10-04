import { useTranslation } from 'react-i18next';
import { ButtonLink } from '@/shared/components/Button';
import { PageTitle } from '@/shared/components/PageTitle';
import { StatusPanel } from '@/shared/components/StatusPanel';
import { CompassIcon } from '@/shared/icons/icons';

export function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle parts={[t('notFound.title')]} />
      <StatusPanel
        headingLevel="h1"
        icon={<CompassIcon size={24} />}
        title={t('notFound.title')}
        description={t('notFound.description')}
        actions={<ButtonLink to="/">{t('notFound.action')}</ButtonLink>}
      />
    </>
  );
}
