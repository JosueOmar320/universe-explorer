import { useTranslation } from 'react-i18next';
import { isRouteErrorResponse, useRouteError } from 'react-router';
import { Button, ButtonLink } from '@/shared/components/Button';
import { PageTitle } from '@/shared/components/PageTitle';
import { StatusPanel } from '@/shared/components/StatusPanel';
import { AlertIcon } from '@/shared/icons/icons';

/** Developer-facing detail, only rendered in development builds (not translated). */
function getErrorMessage(error: unknown): string {
  if (isRouteErrorResponse(error)) return `${error.status} ${error.statusText}`;
  if (error instanceof Error) return error.message;
  return 'Unknown error';
}

/** Router error boundary: catches render errors and failed lazy route imports. */
export function RouteErrorPage() {
  const { t } = useTranslation();
  const error = useRouteError();

  return (
    <>
      <PageTitle parts={[t('routeError.title')]} />
      <StatusPanel
        tone="danger"
        headingLevel="h1"
        icon={<AlertIcon size={24} />}
        title={t('routeError.title')}
        description={
          <>
            <p>{t('routeError.description')}</p>
            {import.meta.env.DEV && <pre>{getErrorMessage(error)}</pre>}
          </>
        }
        actions={
          <>
            <Button onClick={() => window.location.reload()}>{t('routeError.reload')}</Button>
            <ButtonLink to="/" variant="secondary">
              {t('routeError.home')}
            </ButtonLink>
          </>
        }
      />
    </>
  );
}
