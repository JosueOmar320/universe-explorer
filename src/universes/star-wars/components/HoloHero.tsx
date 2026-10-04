import { useTranslation } from 'react-i18next';
import { apiConfig } from '@/config/apis';
import styles from './HoloHero.module.css';

const API_HOST = new URL(apiConfig.starWars.baseUrl).host;

interface HoloHeroProps {
  people?: number;
  worlds?: number;
  species?: number;
  films?: number;
}

export function HoloHero({ people, worlds, species, films }: HoloHeroProps) {
  const { t, i18n } = useTranslation('starWars');
  const format = (value?: number) => value?.toLocaleString(i18n.resolvedLanguage) ?? '——';

  return (
    <section className={styles.hero} aria-labelledby="sw-hero-title">
      <div className={styles.copy}>
        <p className={styles.eyebrow}>{t('hero.eyebrow')}</p>
        <h1 id="sw-hero-title" className={styles.title}>
          {t('hero.titleLine1')}
          <br />
          <span className={styles.titleAccent}>{t('hero.titleLine2')}</span>
        </h1>
        <p className={styles.lead}>{t('hero.lead')}</p>
      </div>

      {/* Holographic readout: real counts from the API, not decoration. */}
      <dl className={styles.holo}>
        <div>
          <dt>{t('hero.records')}</dt>
          <dd>{format(people)}</dd>
        </div>
        <div>
          <dt>{t('hero.worlds')}</dt>
          <dd>{format(worlds)}</dd>
        </div>
        <div>
          <dt>{t('hero.species')}</dt>
          <dd>{format(species)}</dd>
        </div>
        <div>
          <dt>{t('hero.films')}</dt>
          <dd>{format(films)}</dd>
        </div>
        <div className={styles.source}>
          <dt>{t('hero.source')}</dt>
          <dd>{API_HOST}</dd>
        </div>
      </dl>
    </section>
  );
}
