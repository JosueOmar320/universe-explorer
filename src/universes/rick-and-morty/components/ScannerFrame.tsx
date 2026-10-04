import styles from './ScannerFrame.module.css';

interface ScannerFrameProps {
  /** `hover` reveals the viewfinder corners only while the enclosing card is hovered/focused. */
  corners?: 'always' | 'hover';
}

/** Decorative overlay for portraits: scanlines, bottom fade and viewfinder corners. */
export function ScannerFrame({ corners = 'always' }: ScannerFrameProps) {
  return <span className={styles.frame} data-corners={corners} aria-hidden="true" />;
}
