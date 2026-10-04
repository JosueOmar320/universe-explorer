import { isRouteErrorResponse, useRouteError } from 'react-router';
import { Button, ButtonLink } from '@/shared/components/Button';
import { StatusPanel } from '@/shared/components/StatusPanel';
import { AlertIcon } from '@/shared/icons/icons';

function getErrorMessage(error: unknown): string {
  if (isRouteErrorResponse(error)) return `${error.status} ${error.statusText}`;
  if (error instanceof Error) return error.message;
  return 'Unknown error';
}

/** Router error boundary: catches render errors and failed lazy route imports. */
export function RouteErrorPage() {
  const error = useRouteError();

  return (
    <>
      <title>Something went wrong · Universe Explorer</title>
      <StatusPanel
        tone="danger"
        headingLevel="h1"
        icon={<AlertIcon size={24} />}
        title="Something went wrong"
        description={
          <>
            <p>An unexpected error broke this view. Reloading usually fixes it.</p>
            {import.meta.env.DEV && <pre>{getErrorMessage(error)}</pre>}
          </>
        }
        actions={
          <>
            <Button onClick={() => window.location.reload()}>Reload page</Button>
            <ButtonLink to="/" variant="secondary">
              Back to universes
            </ButtonLink>
          </>
        }
      />
    </>
  );
}
