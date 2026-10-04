import type { ReactNode } from 'react';
import { cx } from '@/shared/utils/cx';
import styles from './StatusPanel.module.css';

interface StatusPanelProps {
  title: string;
  description?: ReactNode;
  icon?: ReactNode;
  actions?: ReactNode;
  /** `danger` announces the panel to assistive technology as an alert. */
  tone?: 'neutral' | 'danger';
  /** Use `h1` when the panel is the whole page (e.g. 404). */
  headingLevel?: 'h1' | 'h2';
  className?: string;
}

/** Shared layout for empty, error and not-found states. */
export function StatusPanel({
  title,
  description,
  icon,
  actions,
  tone = 'neutral',
  headingLevel: Heading = 'h2',
  className,
}: StatusPanelProps) {
  return (
    <div
      className={cx(styles.panel, tone === 'danger' && styles.danger, className)}
      role={tone === 'danger' ? 'alert' : undefined}
    >
      {icon && <div className={styles.icon}>{icon}</div>}
      <Heading className={styles.title}>{title}</Heading>
      {description && <div className={styles.description}>{description}</div>}
      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  );
}
