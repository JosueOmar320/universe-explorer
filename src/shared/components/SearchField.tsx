import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CloseIcon, SearchIcon } from '@/shared/icons/icons';
import { cx } from '@/shared/utils/cx';
import fieldStyles from './Field.module.css';
import styles from './SearchField.module.css';

interface SearchFieldProps {
  label: string;
  /** Committed value (usually from the URL). */
  value: string;
  /** Called with the trimmed text after the user stops typing, on Enter, or on clear. */
  onValueChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
}

/**
 * Search input with local draft state and debounced commits, so typing stays responsive
 * and we don't fire a request (or a URL update) per keystroke.
 */
export function SearchField({
  label,
  value,
  onValueChange,
  placeholder,
  debounceMs = 400,
  className,
}: SearchFieldProps) {
  const { t } = useTranslation();
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState(value);
  const lastCommittedRef = useRef(value);
  const onValueChangeRef = useRef(onValueChange);

  useEffect(() => {
    onValueChangeRef.current = onValueChange;
  });

  // Only touches refs, so it's stable across renders.
  const commit = useCallback((next: string) => {
    const normalized = next.trim();
    if (normalized === lastCommittedRef.current) return;
    lastCommittedRef.current = normalized;
    onValueChangeRef.current(normalized);
  }, []);

  // Adopt external changes (e.g. "Clear filters" or back/forward navigation) while
  // ignoring the echo of our own commits, which would otherwise overwrite newer keystrokes.
  useEffect(() => {
    if (value === lastCommittedRef.current) return;
    lastCommittedRef.current = value;
    setDraft(value);
  }, [value]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => commit(draft), debounceMs);
    return () => window.clearTimeout(timeoutId);
  }, [draft, debounceMs, commit]);

  const handleClear = () => {
    setDraft('');
    commit('');
    inputRef.current?.focus();
  };

  return (
    <form
      role="search"
      className={cx(fieldStyles.field, className)}
      onSubmit={(event) => {
        event.preventDefault();
        commit(draft);
      }}
    >
      <label htmlFor={id} className={fieldStyles.label}>
        {label}
      </label>
      <div className={fieldStyles.control}>
        <SearchIcon size={18} className={styles.icon} />
        <input
          ref={inputRef}
          id={id}
          type="search"
          className={styles.input}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck={false}
        />
        {draft && (
          <button
            type="button"
            className={styles.clear}
            onClick={handleClear}
            aria-label={t('search.clear')}
          >
            <CloseIcon size={16} />
          </button>
        )}
      </div>
    </form>
  );
}
