import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/components/Button';
import { SearchField } from '@/shared/components/SearchField';
import { SelectField } from '@/shared/components/SelectField';
import { CloseIcon } from '@/shared/icons/icons';
import type { Film, Species } from '../api/models';
import type { PeopleFilters as Filters } from '../filters';
import type { SetPeopleFilter } from '../hooks/usePeopleFilters';
import { EpisodeFilter } from './EpisodeFilter';
import styles from './PeopleFilters.module.css';

/** Local search: commits can be snappier than for network-backed search. */
const SEARCH_DEBOUNCE_MS = 250;

interface PeopleFiltersProps {
  filters: Filters;
  activeFilterCount: number;
  onFilterChange: SetPeopleFilter;
  onClear: () => void;
  films: Film[] | undefined;
  species: Species[] | undefined;
}

export function PeopleFilters({
  filters,
  activeFilterCount,
  onFilterChange,
  onClear,
  films,
  species = [],
}: PeopleFiltersProps) {
  const { t } = useTranslation('starWars');
  const speciesOptions = [...species]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(({ id, name }) => ({ value: String(id), label: name }));

  return (
    <div className={styles.panel}>
      <SearchField
        className={styles.search}
        label={t('filters.search')}
        placeholder={t('filters.searchPlaceholder')}
        value={filters.q ?? ''}
        debounceMs={SEARCH_DEBOUNCE_MS}
        onValueChange={(q) => onFilterChange('q', q, { replace: true })}
      />
      <SelectField
        className={styles.species}
        label={t('filters.species')}
        value={filters.species}
        options={speciesOptions}
        onChange={(value) => onFilterChange('species', value)}
      />
      <EpisodeFilter
        className={styles.episode}
        films={films}
        value={filters.episode}
        onChange={(episode) => onFilterChange('episode', episode)}
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
  );
}
