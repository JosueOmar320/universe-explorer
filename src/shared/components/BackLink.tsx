import type { MouseEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { ArrowLeftIcon } from '@/shared/icons/icons';
import { isFromListState } from '@/shared/utils/listNavigation';
import styles from './BackLink.module.css';

interface BackLinkProps {
  /** The list to return to when there's no history to go back through. */
  to: string;
  label: string;
}

/**
 * "Back to the list" link for detail pages. When the user came from the list (see
 * `FROM_LIST_STATE`), it goes back in history so filters, page and scroll position are
 * restored. Otherwise (direct link, new tab) it's a regular link.
 */
export function BackLink({ to, label }: BackLinkProps) {
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
    <Link to={to} className={styles.link} onClick={handleClick}>
      <ArrowLeftIcon size={18} />
      {label}
    </Link>
  );
}
