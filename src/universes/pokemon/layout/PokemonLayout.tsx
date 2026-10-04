import { Outlet } from 'react-router';
import '../theme.css';

/** Entry point of the universe: loads its theme (tokens + font) and renders the active page. */
export function PokemonLayout() {
  return <Outlet />;
}
