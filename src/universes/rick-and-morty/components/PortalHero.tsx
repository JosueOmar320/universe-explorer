import { useTranslation } from 'react-i18next';
import { apiConfig } from '@/config/apis';
import styles from './PortalHero.module.css';

const API_HOST = new URL(apiConfig.rickAndMorty.baseUrl).host;

interface PortalHeroProps {
  totalCharacters?: number;
}

export function PortalHero({ totalCharacters }: PortalHeroProps) {
  const { t, i18n } = useTranslation('rickAndMorty');

  return (
    <section className={styles.hero} aria-labelledby="rm-hero-title">
      <div className={styles.copy}>
        <p className={styles.eyebrow}>{t('hero.eyebrow')}</p>
        <h1 id="rm-hero-title" className={styles.title}>
          {t('hero.titleLine1')}
          <br />
          <span className={styles.titleAccent}>{t('hero.titleLine2')}</span>
        </h1>
        <p className={styles.lead}>{t('hero.lead')}</p>
        <dl className={styles.stats}>
          <div>
            <dt>{t('hero.records')}</dt>
            <dd>{totalCharacters?.toLocaleString(i18n.resolvedLanguage) ?? '———'}</dd>
          </div>
          <div>
            <dt>{t('hero.source')}</dt>
            <dd>{API_HOST}</dd>
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
