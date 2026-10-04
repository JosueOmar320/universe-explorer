import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { cx } from '@/shared/utils/cx';
import type { FieldOption } from './fieldOption';
import fieldStyles from './Field.module.css';
import styles from './SegmentedControl.module.css';

interface SegmentedControlProps<T extends string> {
  label: string;
  value: T | undefined;
  options: readonly FieldOption<T>[];
  onChange: (value: T | undefined) => void;
  /** Label of the leading option that clears the selection (defaults to "All"). */
  emptyLabel?: string;
  className?: string;
}

/**
 * Single-choice control built on native radio inputs, so arrow-key navigation and
 * screen reader semantics come for free.
 */
export function SegmentedControl<T extends string>({
  label,
  value,
  options,
  onChange,
  emptyLabel,
  className,
}: SegmentedControlProps<T>) {
  const { t } = useTranslation();
  const name = useId();
  const choices: { value: T | undefined; label: string }[] = [
    { value: undefined, label: emptyLabel ?? t('filters.all') },
    ...options,
  ];

  return (
    <fieldset className={cx(fieldStyles.field, className)}>
      <legend className={fieldStyles.label}>{label}</legend>
      <div className={styles.options}>
        {choices.map((choice) => (
          <label key={choice.value ?? ''} className={styles.option} data-value={choice.value}>
            <input
              type="radio"
              name={name}
              className={styles.input}
              checked={value === choice.value}
              onChange={() => onChange(choice.value)}
            />
            <span className={styles.text}>{choice.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
