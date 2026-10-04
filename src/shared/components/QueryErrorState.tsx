import { useTranslation } from 'react-i18next';
import { type ApiErrorKind, getApiErrorKind } from '@/shared/api/errors';
import { RefreshIcon, AlertIcon } from '@/shared/icons/icons';
import { Button } from './Button';
import { StatusPanel } from './StatusPanel';

const MESSAGE_KEYS = {
  network: 'network',
  timeout: 'timeout',
  'rate-limit': 'rateLimit',
  server: 'server',
  'not-found': 'unknown',
  unknown: 'unknown',
} as const satisfies Record<ApiErrorKind, string>;

interface QueryErrorStateProps {
  error: unknown;
  onRetry: () => void;
  isRetrying: boolean;
  /** Optional themed heading (e.g. "Portal malfunction"); the description stays specific. */
  title?: string;
  headingLevel?: 'h1' | 'h2';
}

/**
 * Error state for failed queries: explains *what* went wrong (offline, timeout, rate limit,
 * server error) instead of a generic message, and always offers a retry.
 */
export function QueryErrorState({
  error,
  onRetry,
  isRetrying,
  title,
  headingLevel,
}: QueryErrorStateProps) {
  const { t } = useTranslation();
  const messageKey = MESSAGE_KEYS[getApiErrorKind(error)];

  return (
    <StatusPanel
      tone="danger"
      headingLevel={headingLevel}
      icon={<AlertIcon size={24} />}
      title={title ?? t(`errors.${messageKey}.title`)}
      description={t(`errors.${messageKey}.description`)}
      actions={
        <Button onClick={onRetry} disabled={isRetrying}>
          <RefreshIcon size={18} />
          {isRetrying ? t('actions.retrying') : t('actions.retry')}
        </Button>
      }
    />
  );
}
