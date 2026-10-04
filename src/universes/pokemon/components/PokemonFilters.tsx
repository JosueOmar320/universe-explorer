import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/components/Button';
import { SearchField } from '@/shared/components/SearchField';
import { CloseIcon } from '@/shared/icons/icons';
import type { PokemonFilters as Filters } from '../filters';
import type { SetPokemonFilter } from '../hooks/usePokemonFilters';
import { TypeFilter } from './TypeFilter';
import styles from './PokemonFilters.module.css';

/** Searching is local, so commits can be snappier than for network-backed search. */
const SEARCH_DEBOUNCE_MS = 250;

interface PokemonFiltersProps {
  filters: Filters;
  activeFilterCount: number;
  onFilterChange: SetPokemonFilter;
  onClear: () => void;
}

export function PokemonFilters({
  filters,
  activeFilterCount,
  onFilterChange,
  onClear,
}: PokemonFiltersProps) {
  const { t } = useTranslation('pokemon');

  return (
    <div className={styles.panel}>
      <div className={styles.searchRow}>
        <SearchField
          className={styles.search}
          label={t('filters.search')}
          placeholder={t('filters.searchPlaceholder')}
          value={filters.q ?? ''}
          debounceMs={SEARCH_DEBOUNCE_MS}
          onValueChange={(q) => onFilterChange('q', q, { replace: true })}
        />
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            className={styles.clear}
            onClick={onClear}
            aria-label={t('filters.clearLabel', { count: activeFilterCount })}
          >
            <CloseIcon size={16} />
            {t('filters.clear', { count: activeFilterCount })}
          </Button>
        )}
      </div>
      <TypeFilter value={filters.type} onChange={(type) => onFilterChange('type', type)} />
    </div>
  );
}
