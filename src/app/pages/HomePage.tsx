import { useTranslation } from 'react-i18next';
import { UniverseCard } from '@/app/components/UniverseCard';
import { PageTitle } from '@/shared/components/PageTitle';
import { isUniverseAvailable, UNIVERSES } from '@/universes/registry';
import styles from './HomePage.module.css';

const availableCount = UNIVERSES.filter(isUniverseAvailable).length;

export function HomePage() {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle />

      <section className={styles.hero} aria-labelledby="home-title">
        <p className={styles.eyebrow}>
          <span className={styles.signal} aria-hidden="true" />
          {t('home.online', { available: availableCount, total: UNIVERSES.length })}
        </p>
        <h1 id="home-title" className={styles.title}>
          {t('home.titleLine1')}
          <br />
          <span className={styles.titleAccent}>{t('home.titleLine2')}</span>
        </h1>
        <p className={styles.lead}>{t('home.lead')}</p>
      </section>

      <section aria-labelledby="universes-title">
        <h2 id="universes-title" className="visually-hidden">
          {t('home.universesHeading')}
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
