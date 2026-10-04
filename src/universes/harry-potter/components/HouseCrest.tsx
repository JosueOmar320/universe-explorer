import { houseColorVars } from '../utils/houses';
import styles from './HouseCrest.module.css';

interface HouseCrestProps {
  house: string | null;
  size?: number;
}

/** Original shield with the house initial (not the official crests). Decorative. */
export function HouseCrest({ house, size = 40 }: HouseCrestProps) {
  return (
    <svg
      className={styles.crest}
      style={houseColorVars(house)}
      width={size}
      height={size * 1.15}
      viewBox="0 0 40 46"
      aria-hidden="true"
      focusable="false"
    >
      <path
        className={styles.shield}
        d="M20 1.5 37.5 7v13.5c0 11-7.5 19.5-17.5 24-10-4.5-17.5-13-17.5-24V7L20 1.5Z"
      />
      <path className={styles.band} d="M2.5 16h35" />
      <text className={styles.initial} x="20" y="31" textAnchor="middle">
        {house?.charAt(0) ?? '·'}
      </text>
    </svg>
  );
}
