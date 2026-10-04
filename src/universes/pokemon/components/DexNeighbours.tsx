import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router';
import { ChevronLeftIcon, ChevronRightIcon } from '@/shared/icons/icons';
import { cx } from '@/shared/utils/cx';
import { usePokedexNeighbours } from '../hooks/usePokedexNeighbours';
import { pokemonPaths } from '../paths';
import { formatDexNumber, formatPokemonName } from '../utils/format';
import styles from './DexNeighbours.module.css';

/**
 * Previous / next species, like flipping through a Pokédex. Browsing replaces the history
 * entry and keeps its state, so "back to the list" still returns to the filtered list the
 * user came from instead of stepping through every Pokémon they viewed.
 */
export function DexNeighbours({ id }: { id: number }) {
  const { t } = useTranslation('pokemon');
  const { state } = useLocation();
  const { previous, next } = usePokedexNeighbours(id);

  if (!previous && !next) return null;

  return (
    <nav aria-label={t('detail.neighbours')} className={styles.neighbours}>
      {previous && (
        <Link
          to={pokemonPaths.pokemon(previous.id)}
          replace
          state={state}
          className={styles.link}
          aria-label={t('detail.previous', { name: formatPokemonName(previous.name) })}
        >
          <ChevronLeftIcon size={18} />
          <span className={styles.number}>{formatDexNumber(previous.id)}</span>
          <span className={styles.name}>{formatPokemonName(previous.name)}</span>
        </Link>
      )}
      {next && (
        <Link
          to={pokemonPaths.pokemon(next.id)}
          replace
          state={state}
          className={cx(styles.link, styles.next)}
          aria-label={t('detail.next', { name: formatPokemonName(next.name) })}
        >
          <span className={styles.number}>{formatDexNumber(next.id)}</span>
          <span className={styles.name}>{formatPokemonName(next.name)}</span>
          <ChevronRightIcon size={18} />
        </Link>
      )}
    </nav>
  );
}
