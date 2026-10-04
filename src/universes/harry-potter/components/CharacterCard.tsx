import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { useRecordNameTransition } from '@/shared/hooks/useRecordNameTransition';
import { FROM_LIST_STATE } from '@/shared/utils/listNavigation';
import type { Character } from '../api/models';
import { harryPotterPaths } from '../paths';
import { houseColorVars } from '../utils/houses';
import { HouseCrest } from './HouseCrest';
import styles from './CharacterCard.module.css';

export function CharacterCard({ character }: { character: Character }) {
  const { t } = useTranslation('harryPotter');
  const unknown = t('values.unknown');
  const href = harryPotterPaths.character(character.slug);
  const nameTransition = useRecordNameTransition(href);

  return (
    <article className={styles.card} style={houseColorVars(character.house)}>
      <div className={styles.ribbon}>
        <HouseCrest house={character.house} size={30} />
        <span className={styles.house}>{character.house ?? t('card.noHouse')}</span>
      </div>

      <h3 className={styles.name} style={nameTransition}>
        {/* Stretched over the card (see ::after); its accessible name is just the name. */}
        <Link to={href} state={FROM_LIST_STATE} viewTransition className={styles.link}>
          {character.name}
        </Link>
      </h3>

      <dl className={styles.facts}>
        <div>
          <dt>{t('card.species')}</dt>
          <dd>{character.species ?? unknown}</dd>
        </div>
        <div>
          <dt>{t('card.bloodStatus')}</dt>
          <dd>{character.bloodStatus ?? unknown}</dd>
        </div>
        <div>
          <dt>{t('card.patronus')}</dt>
          <dd>{character.patronus ?? unknown}</dd>
        </div>
      </dl>
    </article>
  );
}
