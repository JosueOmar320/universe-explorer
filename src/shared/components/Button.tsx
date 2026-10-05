import type { ComponentProps } from 'react';
import { Link, type LinkProps } from 'react-router';
import { cx } from '@/shared/utils/cx';
import styles from './Button.module.css';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface VariantProps {
  variant?: ButtonVariant;
}

// ComponentProps includes `ref`, which React 19 passes as a regular prop.
type ButtonProps = ComponentProps<'button'> & VariantProps;

export function Button({ variant = 'primary', className, type = 'button', ...props }: ButtonProps) {
  return (
    <button type={type} className={cx(styles.button, styles[variant], className)} {...props} />
  );
}

type ButtonLinkProps = LinkProps & VariantProps;

/** A router link styled as a button, for navigation actions. */
export function ButtonLink({ variant = 'primary', className, ...props }: ButtonLinkProps) {
  return <Link className={cx(styles.button, styles[variant], className)} {...props} />;
}
