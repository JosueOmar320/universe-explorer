import { useTranslation } from 'react-i18next';
import type { Character } from '../api/models';
import { houseColorVars } from '../utils/houses';
import { HouseCrest } from './HouseCrest';
import styles from './CharacterCard.module.css';

export function CharacterCard({ character }: { character: Character }) {
  const { t } = useTranslation('harryPotter');
  const unknown = t('values.unknown');

  return (
    <article className={styles.card} style={houseColorVars(character.house)}>
      <div className={styles.ribbon}>
        <HouseCrest house={character.house} size={30} />
        <span className={styles.house}>{character.house ?? t('card.noHouse')}</span>
      </div>

      <h3 className={styles.name}>{character.name}</h3>

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
