import { useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HeadingWithFavorite } from '@/shared/components/FavoriteButton';
import { recordNameTransition } from '@/shared/hooks/useRecordNameTransition';
import type { Character } from '../api/models';
import { harryPotterPaths } from '../paths';
import { houseColorVars } from '../utils/houses';
import { HouseCrest } from './HouseCrest';
import styles from './CharacterFile.module.css';

/** Long lists (Harry has 46 family members) start collapsed to keep the page scannable. */
const COLLAPSED_ITEMS = 8;

/** A registry file: particulars on one side, the character's lists on the other. */
export function CharacterFile({ character }: { character: Character }) {
  const { t } = useTranslation('harryPotter');

  // Only facts the API actually has: an empty ledger line adds nothing.
  const particulars = [
    [t('card.species'), character.species],
    [t('detail.gender'), character.gender],
    [t('card.bloodStatus'), character.bloodStatus],
    [t('detail.nationality'), character.nationality],
    [t('detail.born'), character.born],
    [t('detail.died'), character.died],
    [t('detail.maritalStatus'), character.maritalStatus],
    [t('card.patronus'), character.patronus],
    [t('detail.animagus'), character.animagus],
    [t('detail.boggart'), character.boggart],
    [t('detail.eyes'), character.eyeColor],
    [t('detail.hair'), character.hairColor],
    [t('detail.skin'), character.skinColor],
    [t('detail.height'), character.height],
    [t('detail.weight'), character.weight],
  ].filter((entry): entry is [string, string] => entry[1] !== null);

  const lists = [
    { id: 'wands', title: t('detail.wands'), items: character.wands },
    { id: 'aliases', title: t('detail.aliases'), items: character.aliases },
    { id: 'titles', title: t('detail.titles'), items: character.titles },
    { id: 'jobs', title: t('detail.jobs'), items: character.jobs },
    { id: 'family', title: t('detail.family'), items: character.familyMembers },
    { id: 'romances', title: t('detail.romances'), items: character.romances },
  ].filter((list) => list.items.length > 0);

  return (
    <article
      className={styles.file}
      aria-labelledby="hp-character-name"
      style={houseColorVars(character.house)}
    >
      <header className={styles.header}>
        <HouseCrest house={character.house} size={64} />
        <div className={styles.heading}>
          <p className={styles.house}>{character.house ?? t('card.noHouse')}</p>
          <HeadingWithFavorite
            favorite={{
              universe: 'harry-potter',
              id: character.id,
              name: character.name,
              detail: character.house ?? character.species ?? undefined,
              href: harryPotterPaths.character(character.slug),
            }}
          >
            <h1 id="hp-character-name" className={styles.name} style={recordNameTransition}>
              {character.name}
            </h1>
          </HeadingWithFavorite>
        </div>
      </header>

      <div className={styles.columns}>
        <section aria-labelledby="hp-particulars" className={styles.page}>
          <h2 id="hp-particulars" className={styles.sectionTitle}>
            {t('detail.particulars')}
          </h2>
          <dl className={styles.particulars}>
            {particulars.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {lists.length > 0 && (
          <div className={styles.lists}>
            {lists.map((list) => (
              <ListSection key={list.id} id={list.id} title={list.title} items={list.items} />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

function ListSection({ id, title, items }: { id: string; title: string; items: string[] }) {
  const { t } = useTranslation('harryPotter');
  const listId = useId();
  const [isExpanded, setIsExpanded] = useState(false);
  const isCollapsible = items.length > COLLAPSED_ITEMS;
  const visibleItems = isCollapsible && !isExpanded ? items.slice(0, COLLAPSED_ITEMS) : items;

  return (
    <section aria-labelledby={`hp-${id}`} className={styles.page}>
      <h2 id={`hp-${id}`} className={styles.sectionTitle}>
        {title} <span className={styles.count}>({items.length})</span>
      </h2>
      <ul id={listId} className={styles.items}>
        {visibleItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      {isCollapsible && (
        <button
          type="button"
          className={styles.toggle}
          aria-expanded={isExpanded}
          aria-controls={listId}
          onClick={() => setIsExpanded((expanded) => !expanded)}
        >
          {isExpanded ? t('detail.showLess') : t('detail.showAll', { count: items.length })}
        </button>
      )}
    </section>
  );
}
