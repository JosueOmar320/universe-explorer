import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDownIcon } from '@/shared/icons/icons';
import { cx } from '@/shared/utils/cx';
import type { FieldOption } from './fieldOption';
import fieldStyles from './Field.module.css';
import styles from './SelectField.module.css';

interface SelectFieldProps<T extends string> {
  label: string;
  value: T | undefined;
  options: readonly FieldOption<T>[];
  onChange: (value: T | undefined) => void;
  /** Label of the empty option that clears the selection (defaults to "All"). */
  emptyLabel?: string;
  className?: string;
}

/** Native `<select>` (best keyboard/mobile support) with themed styling. */
export function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
  emptyLabel,
  className,
}: SelectFieldProps<T>) {
  const { t } = useTranslation();
  const id = useId();

  return (
    <div className={cx(fieldStyles.field, className)}>
      <label htmlFor={id} className={fieldStyles.label}>
        {label}
      </label>
      <div className={fieldStyles.control}>
        <select
          id={id}
          className={styles.select}
          value={value ?? ''}
          onChange={(event) =>
            onChange(options.find((option) => option.value === event.target.value)?.value)
          }
        >
          <option value="">{emptyLabel ?? t('filters.all')}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon size={16} className={styles.chevron} />
      </div>
    </div>
  );
}
