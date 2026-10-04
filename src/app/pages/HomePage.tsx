import { UniverseCard } from '@/app/components/UniverseCard';
import { UNIVERSES } from '@/universes/registry';
import styles from './HomePage.module.css';

const availableCount = UNIVERSES.filter((universe) => universe.status === 'available').length;

export function HomePage() {
  return (
    <>
      <title>Universe Explorer</title>

      <section className={styles.hero} aria-labelledby="home-title">
        <p className={styles.eyebrow}>
          <span className={styles.signal} aria-hidden="true" />
          {availableCount} of {UNIVERSES.length} universes online
        </p>
        <h1 id="home-title" className={styles.title}>
          One shell.
          <br />
          <span className={styles.titleAccent}>Many universes.</span>
        </h1>
        <p className={styles.lead}>
          Pick a universe to explore. Each one is powered by a different public API and has its own
          interface, typography and personality.
        </p>
      </section>

      <section aria-labelledby="universes-title">
        <h2 id="universes-title" className="visually-hidden">
          Universes
        </h2>
        <ul className={styles.grid}>
          {UNIVERSES.map((universe, index) => (
            <li key={universe.id}>
              <UniverseCard universe={universe} position={index + 1} />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
