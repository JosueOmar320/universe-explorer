import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Skeleton } from '@/shared/components/Skeleton';
import { FROM_LIST_STATE } from '@/shared/utils/listNavigation';
import type { PokedexEntry, PokemonType } from '../api/models';
import { getSpriteUrl } from '../api/pokeApi';
import { pokemonPaths } from '../paths';
import { formatDexNumber, formatPokemonName } from '../utils/format';
import { TypeBadge } from './TypeBadge';
import styles from './PokemonCard.module.css';

interface PokemonCardProps {
  entry: PokedexEntry;
  /** `undefined` while the type lists load (see usePokedexTypes). */
  types: PokemonType[] | undefined;
  /** Loads the sprite eagerly for cards likely to be visible on first paint. */
  priority?: boolean;
}

/** One species of the Pokédex: sprite, number, name and types. */
export function PokemonCard({ entry, types, priority = false }: PokemonCardProps) {
  const { t } = useTranslation('pokemon');
  const primaryType = types?.[0];

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
        <h3 className={styles.name}>
          {/* Stretched over the card (see ::after); its accessible name is just the name. */}
          <Link to={pokemonPaths.pokemon(entry.id)} state={FROM_LIST_STATE} className={styles.link}>
            {formatPokemonName(entry.name)}
          </Link>
        </h3>
        {types === undefined ? (
          <div className={styles.types} aria-hidden="true">
            <Skeleton width="3.75rem" height="1.5rem" />
          </div>
        ) : (
          types.length > 0 && (
            <ul className={styles.types} aria-label={t('card.types')}>
              {types.map((type) => (
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
