import { useTranslation } from 'react-i18next';
import type { Pokemon, PokemonSpecies } from '../api/models';
import {
  formatDexNumber,
  formatHeight,
  formatPokemonName,
  formatWeight,
  toRomanNumeral,
} from '../utils/format';
import { pickLocalized } from '../utils/localized';
import { typeColorVars } from '../utils/typeColors';
import { TypeBadge } from './TypeBadge';
import styles from './PokemonProfile.module.css';

interface PokemonProfileProps {
  pokemon: Pokemon;
  /** Localized data; the profile still renders (in less detail) if it fails to load. */
  species: PokemonSpecies | undefined;
}

export function PokemonProfile({ pokemon, species }: PokemonProfileProps) {
  const { t, i18n } = useTranslation('pokemon');
  const language = i18n.resolvedLanguage;
  const name =
    (species && pickLocalized(species.names, language)) || formatPokemonName(pokemon.name);
  const genus = species && pickLocalized(species.genus, language);
  const entry = species && pickLocalized(species.flavorText, language);
  // The entry falls back to English when the game text isn't available in the UI language.
  const entryLanguage = language && species?.flavorText[language] ? language : 'en';
  const primaryType = pokemon.types[0];

  return (
    <section className={styles.profile} aria-labelledby="pk-pokemon-name">
      <div className={styles.artwork} style={primaryType ? typeColorVars(primaryType) : undefined}>
        <img
          src={pokemon.artworkUrl}
          alt={t('detail.artworkAlt', { name })}
          width={475}
          height={475}
          fetchPriority="high"
          className={styles.image}
        />
      </div>

      <div className={styles.info}>
        <p className={styles.meta}>
          <span className={styles.number}>{formatDexNumber(pokemon.id)}</span>
          {species && (
            <span>{t('detail.generation', { number: toRomanNumeral(species.generation) })}</span>
          )}
          {species?.isLegendary && <span className={styles.tag}>{t('detail.legendary')}</span>}
          {species?.isMythical && <span className={styles.tag}>{t('detail.mythical')}</span>}
        </p>
        <h1 id="pk-pokemon-name" className={styles.name}>
          {name}
        </h1>
        {genus && <p className={styles.genus}>{genus}</p>}

        <ul className={styles.types} aria-label={t('card.types')}>
          {pokemon.types.map((type) => (
            <li key={type}>
              <TypeBadge type={type} />
            </li>
          ))}
        </ul>

        {entry && (
          <figure className={styles.entry}>
            <figcaption className={styles.entryLabel}>{t('detail.entry')}</figcaption>
            <blockquote lang={entryLanguage}>
              <p>{entry}</p>
            </blockquote>
          </figure>
        )}

        <dl className={styles.facts}>
          <div>
            <dt>{t('detail.height')}</dt>
            <dd>{formatHeight(pokemon.height, language)}</dd>
          </div>
          <div>
            <dt>{t('detail.weight')}</dt>
            <dd>{formatWeight(pokemon.weight, language)}</dd>
          </div>
          <div className={styles.abilities}>
            <dt>{t('detail.abilities')}</dt>
            <dd>
              <ul>
                {pokemon.abilities.map((ability) => (
                  <li key={ability.name}>
                    {formatPokemonName(ability.name)}
                    {ability.isHidden && (
                      <span className={styles.hidden}> ({t('detail.hiddenAbility')})</span>
                    )}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
