import { Outlet } from 'react-router';
import '../theme.css';

/** Entry point of the universe: loads its theme (tokens + fonts) and renders the active page. */
export function RickAndMortyLayout() {
  return <Outlet />;
}
