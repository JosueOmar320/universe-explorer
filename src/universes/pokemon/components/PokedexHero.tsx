import { useTranslation } from 'react-i18next';
import { apiConfig } from '@/config/apis';
import { formatDexNumber } from '../utils/format';
import styles from './PokedexHero.module.css';

const API_HOST = new URL(apiConfig.pokemon.baseUrl).host;

export function PokedexHero({ totalSpecies }: { totalSpecies?: number }) {
  const { t, i18n } = useTranslation('pokemon');

  return (
    <section className={styles.hero} aria-labelledby="pk-hero-title">
      <div className={styles.copy}>
        <p className={styles.eyebrow}>{t('hero.eyebrow')}</p>
        <h1 id="pk-hero-title" className={styles.title}>
          {t('hero.titleLine1')}
          <br />
          <span className={styles.titleAccent}>{t('hero.titleLine2')}</span>
        </h1>
        <p className={styles.lead}>{t('hero.lead')}</p>
        <dl className={styles.stats}>
          <div>
            <dt>{t('hero.species')}</dt>
            <dd>{totalSpecies?.toLocaleString(i18n.resolvedLanguage) ?? '———'}</dd>
          </div>
          <div>
            <dt>{t('hero.source')}</dt>
            <dd>{API_HOST}</dd>
          </div>
        </dl>
      </div>

      {/* Decorative handheld device (original design, no official artwork). */}
      <div className={styles.device} aria-hidden="true">
        <div className={styles.lights}>
          <span className={styles.lens} />
          <span />
          <span />
          <span />
        </div>
        <div className={styles.screen}>
          <span className={styles.screenLabel}>NO.</span>
          <span className={styles.screenValue}>
            {formatDexNumber(1)}–{formatDexNumber(totalSpecies ?? 0)}
          </span>
          <span className={styles.cursor} />
        </div>
        <div className={styles.controls}>
          <span className={styles.dpad} />
          <span className={styles.button} />
        </div>
      </div>
    </section>
  );
}
