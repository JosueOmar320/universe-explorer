import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/components/Button';
import { SearchField } from '@/shared/components/SearchField';
import { CloseIcon } from '@/shared/icons/icons';
import type { CharacterFilters as Filters } from '../filters';
import type { SetCharacterFilter } from '../hooks/useCharacterFilters';
import { HouseFilter } from './HouseFilter';
import styles from './CharacterFilters.module.css';

interface CharacterFiltersProps {
  filters: Filters;
  activeFilterCount: number;
  onFilterChange: SetCharacterFilter;
  onClear: () => void;
}

export function CharacterFilters({
  filters,
  activeFilterCount,
  onFilterChange,
  onClear,
}: CharacterFiltersProps) {
  const { t } = useTranslation('harryPotter');

  return (
    <div className={styles.panel}>
      <div className={styles.searchRow}>
        {/* Server-side search: the default debounce avoids a request per keystroke. */}
        <SearchField
          className={styles.search}
          label={t('filters.search')}
          placeholder={t('filters.searchPlaceholder')}
          value={filters.q ?? ''}
          onValueChange={(q) => onFilterChange('q', q, { replace: true })}
        />
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            onClick={onClear}
            aria-label={t('filters.clearLabel', { count: activeFilterCount })}
          >
            <CloseIcon size={16} />
            {t('filters.clear', { count: activeFilterCount })}
          </Button>
        )}
      </div>
      <HouseFilter value={filters.house} onChange={(house) => onFilterChange('house', house)} />
    </div>
  );
}
