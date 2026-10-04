import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { recordNameTransition } from '@/shared/hooks/useRecordNameTransition';
import type { Craft, Person } from '../api/models';
import { useArchive } from '../hooks/useArchive';
import { useCraft } from '../hooks/useCraft';
import {
  formatCentimetres,
  formatEpisode,
  formatKilograms,
  formatRecordNumber,
} from '../utils/format';
import { getSpeciesIds } from '../utils/people';
import styles from './PersonDossier.module.css';

export function PersonDossier({ person }: { person: Person }) {
  const { t, i18n } = useTranslation('starWars');
  const language = i18n.resolvedLanguage;
  const { planetsById, speciesById, films } = useArchive();
  const { starshipsById, vehiclesById } = useCraft();
  const unknown = t('values.unknown');

  const homeworld = person.homeworldId === null ? undefined : planetsById?.get(person.homeworldId);
  const [speciesId] = getSpeciesIds(person);
  const species = speciesId === undefined ? undefined : speciesById?.get(speciesId);
  const appearances = films?.filter((film) => person.filmIds.includes(film.id)) ?? [];
  const value = (text: string | null) => text ?? unknown;

  return (
    <article className={styles.dossier} aria-labelledby="sw-person-name">
      <header className={styles.header}>
        <p className={styles.record}>REC·{formatRecordNumber(person.id)}</p>
        <h1 id="sw-person-name" className={styles.name} style={recordNameTransition}>
          {person.name}
        </h1>
        <p className={styles.origin}>
          {[species?.name, homeworld?.name].filter(Boolean).join(' · ')}
        </p>
      </header>

      <div className={styles.columns}>
        <Panel title={t('detail.profile')}>
          <dl className={styles.facts}>
            <Fact label={t('card.height')}>
              {person.heightCm === null ? unknown : formatCentimetres(person.heightCm, language)}
            </Fact>
            <Fact label={t('card.mass')}>
              {person.massKg === null ? unknown : formatKilograms(person.massKg, language)}
            </Fact>
            <Fact label={t('card.born')}>{value(person.birthYear)}</Fact>
            <Fact label={t('detail.gender')}>{value(person.gender)}</Fact>
            <Fact label={t('detail.hair')}>{value(person.hairColor)}</Fact>
            <Fact label={t('detail.skin')}>{value(person.skinColor)}</Fact>
            <Fact label={t('detail.eyes')}>{value(person.eyeColor)}</Fact>
          </dl>
        </Panel>

        <div className={styles.stack}>
          <Panel title={t('detail.homeworld')} heading={homeworld?.name}>
            <dl className={styles.facts}>
              <Fact label={t('detail.climate')}>{value(homeworld?.climate ?? null)}</Fact>
              <Fact label={t('detail.terrain')}>{value(homeworld?.terrain ?? null)}</Fact>
              <Fact label={t('detail.population')}>
                {homeworld?.population == null
                  ? unknown
                  : new Intl.NumberFormat(language, { notation: 'compact' }).format(
                      homeworld.population,
                    )}
              </Fact>
            </dl>
          </Panel>
          <Panel title={t('detail.species')} heading={species?.name}>
            <dl className={styles.facts}>
              <Fact label={t('detail.classification')}>
                {value(species?.classification ?? null)}
              </Fact>
              <Fact label={t('detail.language')}>{value(species?.language ?? null)}</Fact>
            </dl>
          </Panel>
        </div>
      </div>

      <section aria-labelledby="sw-filmography" className={styles.section}>
        <h2 id="sw-filmography" className={styles.sectionTitle}>
          {t('detail.filmography')}
        </h2>
        <ol className={styles.films}>
          {appearances.map((film) => (
            <li key={film.id} className={styles.film}>
              <span
                className={styles.episode}
                aria-label={t('detail.episode', { number: formatEpisode(film.episode) })}
              >
                {formatEpisode(film.episode)}
              </span>
              <span className={styles.filmTitle}>{film.title}</span>
              <span className={styles.filmMeta}>
                {t('detail.filmMeta', {
                  year: film.releaseDate.slice(0, 4),
                  director: film.director,
                })}
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="sw-craft" className={styles.section}>
        <h2 id="sw-craft" className={styles.sectionTitle}>
          {t('detail.craft')}
        </h2>
        <div className={styles.craftColumns}>
          <CraftList
            title={t('detail.starships')}
            ids={person.starshipIds}
            craftById={starshipsById}
          />
          <CraftList
            title={t('detail.vehicles')}
            ids={person.vehicleIds}
            craftById={vehiclesById}
          />
        </div>
      </section>
    </article>
  );
}

function Panel({
  title,
  heading,
  children,
}: {
  title: string;
  heading?: string;
  children: ReactNode;
}) {
  return (
    <section className={styles.panel}>
      <h2 className={styles.panelTitle}>
        {title}
        {heading && <span className={styles.panelHeading}>{heading}</span>}
      </h2>
      {children}
    </section>
  );
}

function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={styles.fact}>
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

interface CraftListProps {
  title: string;
  ids: number[];
  craftById: Map<number, Craft> | undefined;
}

function CraftList({ title, ids, craftById }: CraftListProps) {
  const { t } = useTranslation('starWars');
  const craft = ids.map((id) => craftById?.get(id)).filter((item) => item !== undefined);

  return (
    <div>
      <h3 className={styles.craftTitle}>{title}</h3>
      {ids.length === 0 ? (
        <p className={styles.none}>{t('detail.noCraft')}</p>
      ) : (
        <ul className={styles.craftList}>
          {craft.map((item) => (
            <li key={item.id}>
              <span className={styles.craftName}>{item.name}</span>
              <span className={styles.craftModel}>{item.model}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
