import type { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router';
import { ArrowLeftIcon } from '@/shared/icons/icons';
import { isFromListState, rickAndMortyPaths } from '../paths';
import styles from './BackToCharactersLink.module.css';

/**
 * When the user came from the listing, go back in history so filters, page and scroll
 * position are restored. Otherwise (direct link, new tab) it's a regular link.
 */
export function BackToCharactersLink() {
  const { t } = useTranslation('rickAndMorty');
  const location = useLocation();
  const navigate = useNavigate();
  const cameFromList = isFromListState(location.state);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const isPlainClick =
      event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
    if (cameFromList && isPlainClick) {
      event.preventDefault();
      void navigate(-1);
    }
  };

  return (
    <Link to={rickAndMortyPaths.characters} className={styles.link} onClick={handleClick}>
      <ArrowLeftIcon size={18} />
      {t('detail.back')}
    </Link>
  );
}
