import { type ReactNode, useEffect, useId, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import fieldStyles from '@/shared/components/Field.module.css';
import { cx } from '@/shared/utils/cx';
import { POKEMON_TYPES, type PokemonType } from '../api/models';
import { useTypeName } from '../hooks/useTypeName';
import { typeColorVars } from '../utils/typeColors';
import styles from './TypeFilter.module.css';

interface TypeFilterProps {
  value: PokemonType | undefined;
  onChange: (type: PokemonType | undefined) => void;
  className?: string;
}

/**
 * Single-choice type filter built on native radio inputs (arrow keys, screen reader
 * semantics). Rendering every type also prefetches each type's species list, so selecting
 * one filters instantly.
 */
export function TypeFilter({ value, onChange, className }: TypeFilterProps) {
  const { t } = useTranslation(['pokemon', 'common']);
  const name = useId();
  const chipsRef = useRef<HTMLDivElement>(null);

  // On phones the chips are a horizontal scroller: keep the selected type in view (e.g. when
  // arriving from a shared link). Only the row scrolls horizontally; the page never moves.
  useEffect(() => {
    const container = chipsRef.current;
    const selected = container?.querySelector<HTMLElement>(`[data-value="${value ?? 'all'}"]`);
    if (!container || !selected || container.scrollWidth <= container.clientWidth) return;
    container.scrollLeft =
      selected.offsetLeft -
      container.offsetLeft -
      (container.clientWidth - selected.offsetWidth) / 2;
  }, [value]);

  return (
    <fieldset className={cx(fieldStyles.field, className)}>
      <legend className={fieldStyles.label}>{t('filters.type')}</legend>
      <div ref={chipsRef} className={styles.chips}>
        <Chip name={name} checked={value === undefined} onSelect={() => onChange(undefined)}>
          {t('common:filters.all')}
        </Chip>
        {POKEMON_TYPES.map((type) => (
          <TypeChip
            key={type}
            type={type}
            name={name}
            checked={value === type}
            onSelect={() => onChange(type)}
          />
        ))}
      </div>
    </fieldset>
  );
}

interface ChipProps {
  name: string;
  checked: boolean;
  onSelect: () => void;
  type?: PokemonType;
  children: ReactNode;
}

function Chip({ name, checked, onSelect, type, children }: ChipProps) {
  return (
    <label
      className={styles.chip}
      data-value={type ?? 'all'}
      style={type ? typeColorVars(type) : undefined}
    >
      <input
        type="radio"
        name={name}
        className={styles.input}
        checked={checked}
        onChange={onSelect}
      />
      <span className={styles.text}>
        {type && <span className={styles.swatch} aria-hidden="true" />}
        {children}
      </span>
    </label>
  );
}

function TypeChip({ type, ...props }: Omit<ChipProps, 'children'> & { type: PokemonType }) {
  const label = useTypeName(type);
  return (
    <Chip type={type} {...props}>
      {label}
    </Chip>
  );
}
