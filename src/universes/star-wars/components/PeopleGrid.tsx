import type { Person } from '../api/models';
import { PersonCard } from './PersonCard';
import styles from './PeopleGrid.module.css';

export function PeopleGrid({ people }: { people: Person[] }) {
  return (
    <ul className={styles.grid}>
      {people.map((person) => (
        <li key={person.id}>
          <PersonCard person={person} />
        </li>
      ))}
    </ul>
  );
}
