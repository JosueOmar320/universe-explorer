import { Button } from '@/shared/components/Button';
import { SearchField } from '@/shared/components/SearchField';
import { SegmentedControl } from '@/shared/components/SegmentedControl';
import { SelectField } from '@/shared/components/SelectField';
import { CloseIcon } from '@/shared/icons/icons';
import type { CharacterFilters as Filters } from '../api/types';
import { GENDER_OPTIONS, SPECIES_OPTIONS, STATUS_OPTIONS } from '../filters';
import type { SetCharacterFilter } from '../hooks/useCharacterFilters';
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
  return (
    <div className={styles.panel}>
      <SearchField
        className={styles.search}
        label="Search by name"
        placeholder="Rick, Morty, Birdperson…"
        value={filters.name ?? ''}
        onValueChange={(name) => onFilterChange('name', name, { replace: true })}
      />
      <SegmentedControl
        className={styles.status}
        label="Status"
        value={filters.status}
        options={STATUS_OPTIONS}
        onChange={(status) => onFilterChange('status', status)}
      />
      <SelectField
        className={styles.gender}
        label="Gender"
        value={filters.gender}
        options={GENDER_OPTIONS}
        onChange={(gender) => onFilterChange('gender', gender)}
      />
      <SelectField
        className={styles.species}
        label="Species"
        value={filters.species}
        options={SPECIES_OPTIONS}
        onChange={(species) => onFilterChange('species', species)}
      />
      {activeFilterCount > 0 && (
        <Button
          variant="ghost"
          className={styles.clear}
          onClick={onClear}
          aria-label={`Clear ${activeFilterCount} active ${activeFilterCount === 1 ? 'filter' : 'filters'}`}
        >
          <CloseIcon size={16} />
          Clear ({activeFilterCount})
        </Button>
      )}
    </div>
  );
}
