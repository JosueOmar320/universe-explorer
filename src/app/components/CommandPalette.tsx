import { keepPreviousData, useQueries } from '@tanstack/react-query';
import { type CSSProperties, type KeyboardEvent, useEffect, useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue';
import { ArrowRightIcon, SearchIcon } from '@/shared/icons/icons';
import { searchableUniverses } from '@/universes/search';
import type { SearchHit } from '@/universes/types';
import styles from './CommandPalette.module.css';

export const MIN_QUERY_LENGTH = 2;
const RESULTS_PER_UNIVERSE = 5;
const DEBOUNCE_MS = 250;

interface CommandPaletteProps {
  /** Called once the dialog has closed; `navigated` when the user opened a result. */
  onClose: (navigated: boolean) => void;
}

interface Option {
  id: string;
  href: string;
}

/**
 * Global search across every universe, in a modal dialog. Follows the ARIA combobox pattern:
 * focus stays in the input, arrow keys move the active option (`aria-activedescendant`) and
 * Enter opens it. Each universe answers with its own strategy (see src/universes/search.ts).
 */
export function CommandPalette({ onClose }: CommandPaletteProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigatedRef = useRef(false);
  const baseId = useId();
  const listboxId = `${baseId}-results`;

  const [input, setInput] = useState('');
  const query = useDebouncedValue(input.trim(), DEBOUNCE_MS);
  const isSearchable = query.length >= MIN_QUERY_LENGTH;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
    inputRef.current?.focus();
    // Light dismiss: a click on the dialog itself (not its content) is a click on the
    // backdrop. Escape is handled natively (the `cancel` event closes the dialog).
    const closeOnBackdrop = (event: MouseEvent) => {
      if (event.target === dialog) dialog.close();
    };
    dialog.addEventListener('click', closeOnBackdrop);
    return () => dialog.removeEventListener('click', closeOnBackdrop);
  }, []);

  const results = useQueries({
    queries: searchableUniverses.map((universe) => ({
      queryKey: ['search', universe.id, query] as const,
      queryFn: ({ client }) => universe.search(query, client, RESULTS_PER_UNIVERSE),
      enabled: isSearchable,
      // Keeps the previous results on screen while the next query loads.
      placeholderData: keepPreviousData,
    })),
  });

  const groups = isSearchable
    ? searchableUniverses.map((universe, index) => ({ universe, result: results[index] }))
    : [];

  // The options, in display order, for keyboard navigation.
  const options: Option[] = [];
  const optionId = (universeId: string, key: string) => `${baseId}-${universeId}-${key}`;
  for (const { universe, result } of groups) {
    const data = result?.data;
    if (!data) continue;
    for (const hit of data.hits) {
      options.push({ id: optionId(universe.id, hit.id), href: hit.href });
    }
    if (data.total > data.hits.length) {
      options.push({ id: optionId(universe.id, 'all'), href: universe.listingHref(query) });
    }
  }

  // The active option resets to the first one whenever the query changes.
  const [active, setActive] = useState({ query, index: 0 });
  const activeIndex = active.query === query ? Math.min(active.index, options.length - 1) : 0;
  const activeOption = options[activeIndex];
  const setActiveIndex = (index: number) => setActive({ query, index });
  const activate = (id: string) => setActiveIndex(options.findIndex((option) => option.id === id));

  useEffect(() => {
    if (activeOption)
      document.getElementById(activeOption.id)?.scrollIntoView({ block: 'nearest' });
  }, [activeOption]);

  const close = () => dialogRef.current?.close();

  const openResult = (href: string) => {
    navigatedRef.current = true;
    close();
    void navigate(href);
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (options.length === 0) return;
      const step = event.key === 'ArrowDown' ? 1 : -1;
      setActiveIndex((activeIndex + step + options.length) % options.length);
    } else if (event.key === 'Enter' && activeOption) {
      event.preventDefault();
      openResult(activeOption.href);
    }
  };

  const isFetching = groups.some(({ result }) => result?.isFetching);
  const isPaused = groups.some(({ result }) => result?.fetchStatus === 'paused');
  const failed = groups.filter(({ result }) => result?.isError && !result.data);
  const totalMatches = groups.reduce((sum, { result }) => sum + (result?.data?.total ?? 0), 0);

  const getStatus = (): string => {
    if (!isSearchable) return '';
    if (isPaused) return t('search.offline');
    if (isFetching) return t('search.searching');
    if (totalMatches === 0 && failed.length === 0) return t('search.noResults', { query });
    return t('search.resultCount', { count: totalMatches });
  };

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-label={t('search.title')}
      onClose={() => onClose(navigatedRef.current)}
    >
      <div className={styles.inputRow}>
        <SearchIcon size={20} className={styles.inputIcon} />
        <input
          ref={inputRef}
          className={styles.input}
          type="text"
          role="combobox"
          aria-label={t('search.label')}
          aria-expanded={options.length > 0}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={activeOption?.id}
          placeholder={t('search.placeholder')}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleInputKeyDown}
          autoComplete="off"
          spellCheck={false}
        />
        <button type="button" className={styles.close} onClick={close}>
          <kbd aria-hidden="true">Esc</kbd>
          <span className="visually-hidden">{t('search.close')}</span>
        </button>
      </div>

      <div className={styles.body}>
        {!isSearchable && (
          <p className={styles.hint}>{t('search.hint', { min: MIN_QUERY_LENGTH })}</p>
        )}

        <div
          id={listboxId}
          role="listbox"
          aria-label={t('search.results')}
          className={styles.listbox}
          hidden={options.length === 0}
        >
          {groups.map(({ universe, result }) => {
            const data = result?.data;
            if (!data || data.hits.length === 0) return null;
            const headingId = optionId(universe.id, 'heading');
            const allId = optionId(universe.id, 'all');

            return (
              <div
                key={universe.id}
                role="group"
                aria-labelledby={headingId}
                className={styles.group}
                style={{ '--universe-accent': universe.accentColor } as CSSProperties}
              >
                <div id={headingId} role="presentation" className={styles.groupHeading}>
                  {universe.name}
                </div>
                {data.hits.map((hit) => {
                  const id = optionId(universe.id, hit.id);
                  return (
                    <ResultOption
                      key={hit.id}
                      id={id}
                      hit={hit}
                      isActive={activeOption?.id === id}
                      onActivate={() => activate(id)}
                      onOpen={() => openResult(hit.href)}
                    />
                  );
                })}
                {data.total > data.hits.length && (
                  <ResultOption
                    id={allId}
                    hit={{
                      id: 'all',
                      name: t('search.seeAll', { count: data.total, universe: universe.name }),
                      href: universe.listingHref(query),
                    }}
                    isActive={activeOption?.id === allId}
                    isSeeAll
                    onActivate={() => activate(allId)}
                    onOpen={() => openResult(universe.listingHref(query))}
                  />
                )}
              </div>
            );
          })}
        </div>

        {failed.map(({ universe }) => (
          <p key={universe.id} className={styles.error}>
            {t('search.error', { universe: universe.name })}
          </p>
        ))}
      </div>

      <div className={styles.footer}>
        <p role="status" className={styles.status}>
          {getStatus()}
        </p>
        <p className={styles.keys} aria-hidden="true">
          <kbd>↑</kbd>
          <kbd>↓</kbd> {t('search.navigate')} <kbd>↵</kbd> {t('search.select')}
        </p>
      </div>
    </dialog>
  );
}

interface ResultOptionProps {
  id: string;
  hit: SearchHit;
  isActive: boolean;
  isSeeAll?: boolean;
  onActivate: () => void;
  onOpen: () => void;
}

function ResultOption({
  id,
  hit,
  isActive,
  isSeeAll = false,
  onActivate,
  onOpen,
}: ResultOptionProps) {
  return (
    // Keyboard interaction lives in the combobox input (aria-activedescendant), as the ARIA
    // combobox pattern prescribes; options mostly react to the pointer.
    <div
      id={id}
      role="option"
      tabIndex={-1}
      aria-selected={isActive}
      className={styles.option}
      data-see-all={isSeeAll || undefined}
      onMouseMove={isActive ? undefined : onActivate}
      // Keeps focus (and typing) in the input.
      onMouseDown={(event) => event.preventDefault()}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === 'Enter') onOpen();
      }}
    >
      <span className={styles.optionName}>{hit.name}</span>
      {hit.detail && <span className={styles.optionDetail}>{hit.detail}</span>}
      {isSeeAll && <ArrowRightIcon size={16} className={styles.optionArrow} />}
    </div>
  );
}
