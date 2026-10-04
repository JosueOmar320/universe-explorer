import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/shared/components/Skeleton';
import type { PokedexEntry } from '../api/models';
import { getSpriteUrl } from '../api/pokeApi';
import { usePokemon } from '../hooks/usePokemon';
import { formatDexNumber, formatPokemonName } from '../utils/format';
import { TypeBadge } from './TypeBadge';
import styles from './PokemonCard.module.css';

interface PokemonCardProps {
  entry: PokedexEntry;
  /** Loads the sprite eagerly for cards likely to be visible on first paint. */
  priority?: boolean;
}

/**
 * The index only has number + name, so each card loads its own types. Those queries are
 * cached forever and deduplicated, so revisiting a page costs nothing.
 */
export function PokemonCard({ entry, priority = false }: PokemonCardProps) {
  const { t } = useTranslation('pokemon');
  const { data: pokemon, isPending } = usePokemon(entry.id);
  const primaryType = pokemon?.types[0];

  return (
    <article
      className={styles.card}
      style={primaryType ? { '--card-type': `var(--pk-type-${primaryType})` } : undefined}
    >
      <div className={styles.media}>
        {/* Decorative: the name is the card heading. */}
        <img
          src={getSpriteUrl(entry.id)}
          alt=""
          width={96}
          height={96}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className={styles.sprite}
        />
      </div>

      <div className={styles.body}>
        <span className={styles.number}>{formatDexNumber(entry.id)}</span>
        <h3 className={styles.name}>{formatPokemonName(entry.name)}</h3>
        {isPending ? (
          <div className={styles.types} aria-hidden="true">
            <Skeleton width="3.75rem" height="1.5rem" />
          </div>
        ) : (
          pokemon && (
            <ul className={styles.types} aria-label={t('card.types')}>
              {pokemon.types.map((type) => (
                <li key={type}>
                  <TypeBadge type={type} />
                </li>
              ))}
            </ul>
          )
        )}
      </div>
    </article>
  );
}
