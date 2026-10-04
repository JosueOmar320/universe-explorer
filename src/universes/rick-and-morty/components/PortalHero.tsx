import styles from './PortalHero.module.css';

interface PortalHeroProps {
  totalCharacters?: number;
}

export function PortalHero({ totalCharacters }: PortalHeroProps) {
  return (
    <section className={styles.hero} aria-labelledby="rm-hero-title">
      <div className={styles.copy}>
        <p className={styles.eyebrow}>Interdimensional census · Archive 01</p>
        <h1 id="rm-hero-title" className={styles.title}>
          Every being.
          <br />
          <span className={styles.titleAccent}>Every dimension.</span>
        </h1>
        <p className={styles.lead}>
          Browse the humans, aliens, robots and assorted abominations catalogued across the
          multiverse.
        </p>
        <dl className={styles.stats}>
          <div>
            <dt>Records</dt>
            <dd>{totalCharacters?.toLocaleString('en-US') ?? '———'}</dd>
          </div>
          <div>
            <dt>Source</dt>
            <dd>rickandmortyapi.com</dd>
          </div>
        </dl>
      </div>

      <div className={styles.portal} aria-hidden="true">
        <span className={styles.portalRing} />
        <span className={styles.portalSwirl} />
        <span className={styles.portalCore} />
      </div>
    </section>
  );
}
