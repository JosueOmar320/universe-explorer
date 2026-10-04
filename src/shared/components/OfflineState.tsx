import { useTranslation } from 'react-i18next';
import { WifiOffIcon } from '@/shared/icons/icons';
import { StatusPanel } from './StatusPanel';

/**
 * Shown when a query is paused because the browser is offline. TanStack Query pauses
 * (instead of failing) and resumes on reconnect, so no retry button is needed.
 */
export function OfflineState({ headingLevel }: { headingLevel?: 'h1' | 'h2' }) {
  const { t } = useTranslation();

  return (
    <div role="status">
      <StatusPanel
        headingLevel={headingLevel}
        icon={<WifiOffIcon size={24} />}
        title={t('offline.title')}
        description={t('offline.description')}
      />
    </div>
  );
}
