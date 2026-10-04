import type { CSSProperties } from 'react';
import { cx } from '@/shared/utils/cx';
import styles from './Skeleton.module.css';

interface SkeletonProps {
  width?: CSSProperties['width'];
  height?: CSSProperties['height'];
  className?: string;
}

/** Placeholder block with a shimmer. Hidden from assistive tech; announce loading elsewhere. */
export function Skeleton({ width, height, className }: SkeletonProps) {
  return (
    <span className={cx(styles.skeleton, className)} style={{ width, height }} aria-hidden="true" />
  );
}
