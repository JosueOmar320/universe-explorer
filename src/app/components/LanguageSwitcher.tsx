import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '@/i18n/config';
import { changeLanguage } from '@/i18n/i18n';
import { cx } from '@/shared/utils/cx';
import styles from './LanguageSwitcher.module.css';

/**
 * "EN | ES" toggle. Each button is announced by its full language name, pronounced in that
 * language (`lang`), and exposes the current choice with `aria-pressed`.
 */
export function LanguageSwitcher() {
  const { t, i18n } = useTranslation();

  return (
    <div role="group" aria-label={t('language.label')} className={styles.switcher}>
      {SUPPORTED_LANGUAGES.map(({ code, label, shortLabel }) => {
        const isActive = i18n.resolvedLanguage === code;
        return (
          <button
            key={code}
            type="button"
            lang={code}
            aria-label={label}
            aria-pressed={isActive}
            className={cx(styles.option, isActive && styles.active)}
            onClick={() => void changeLanguage(code)}
          >
            {shortLabel}
          </button>
        );
      })}
    </div>
  );
}
