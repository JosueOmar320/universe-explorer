import { ButtonLink } from '@/shared/components/Button';
import { StatusPanel } from '@/shared/components/StatusPanel';
import { CompassIcon } from '@/shared/icons/icons';

export function NotFoundPage() {
  return (
    <>
      <title>Page not found · Universe Explorer</title>
      <StatusPanel
        headingLevel="h1"
        icon={<CompassIcon size={24} />}
        title="Page not found"
        description="These coordinates don't match any known universe."
        actions={<ButtonLink to="/">Back to universes</ButtonLink>}
      />
    </>
  );
}
