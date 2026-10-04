import { useTranslation } from 'react-i18next';
import { apiConfig } from '@/config/apis';
import { useRegistryCounts } from '../hooks/useRegistryCounts';
import { HouseCrest } from './HouseCrest';
import styles from './RegistryHero.module.css';

const API_HOST = new URL(apiConfig.harryPotter.baseUrl).host;

export function RegistryHero() {
  const { t, i18n } = useTranslation('harryPotter');
  const { houses, students, everyone } = useRegistryCounts();
  const format = (value?: number) => value?.toLocaleString(i18n.resolvedLanguage) ?? '—';

  return (
    <section className={styles.hero} aria-labelledby="hp-hero-title">
      <div className={styles.copy}>
        <p className={styles.eyebrow}>{t('hero.eyebrow')}</p>
        <h1 id="hp-hero-title" className={styles.title}>
          {t('hero.titleLine1')}
          <br />
          <span className={styles.titleAccent}>{t('hero.titleLine2')}</span>
        </h1>
        <p className={styles.lead}>{t('hero.lead')}</p>
        <dl className={styles.stats}>
          <div>
            <dt>{t('hero.students')}</dt>
            <dd>{format(students)}</dd>
          </div>
          <div>
            <dt>{t('hero.everyone')}</dt>
            <dd>{format(everyone)}</dd>
          </div>
          <div>
            <dt>{t('hero.source')}</dt>
            <dd>{API_HOST}</dd>
          </div>
        </dl>
      </div>

      <figure className={styles.houses} aria-labelledby="hp-houses-title">
        <figcaption id="hp-houses-title" className={styles.housesTitle}>
          {t('hero.houses')}
        </figcaption>
        <dl className={styles.houseList}>
          {houses.map(({ house, count }) => (
            <div key={house} className={styles.house}>
              <HouseCrest house={house} size={44} />
              <dt>{house}</dt>
              <dd>{format(count)}</dd>
            </div>
          ))}
        </dl>
      </figure>
    </section>
  );
}
