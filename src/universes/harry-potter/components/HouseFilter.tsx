import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import fieldStyles from '@/shared/components/Field.module.css';
import { cx } from '@/shared/utils/cx';
import { pickOption } from '@/shared/utils/pickOption';
import { HOGWARTS_HOUSES } from '../api/models';
import { HOUSE_FILTERS, type HouseFilter as HouseFilterValue } from '../filters';
import { HouseCrest } from './HouseCrest';
import styles from './HouseFilter.module.css';

interface HouseFilterProps {
  value: HouseFilterValue | undefined;
  onChange: (value: HouseFilterValue | undefined) => void;
  className?: string;
}

/** Scope of the list as one radio group: students (default), a single house, or everyone. */
export function HouseFilter({ value, onChange, className }: HouseFilterProps) {
  const { t } = useTranslation('harryPotter');
  const name = useId();

  const options: { value: HouseFilterValue | undefined; label: string; house?: string }[] = [
    { value: undefined, label: t('filters.students') },
    ...HOGWARTS_HOUSES.map((house) => ({
      value: pickOption(house.toLowerCase(), HOUSE_FILTERS),
      label: house,
      house,
    })),
    { value: 'everyone', label: t('filters.everyone') },
  ];

  return (
    <fieldset className={cx(fieldStyles.field, className)}>
      <legend className={fieldStyles.label}>{t('filters.scope')}</legend>
      <div className={styles.options}>
        {options.map((option) => (
          <label key={option.value ?? 'students'} className={styles.option}>
            <input
              type="radio"
              name={name}
              className={styles.input}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            <span className={styles.text}>
              {option.house && <HouseCrest house={option.house} size={18} />}
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
