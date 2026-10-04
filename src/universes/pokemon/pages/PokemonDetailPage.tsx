import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { isHttpError } from '@/shared/api/httpClient';
import { BackLink } from '@/shared/components/BackLink';
import { ButtonLink } from '@/shared/components/Button';
import { OfflineState } from '@/shared/components/OfflineState';
import { PageTitle } from '@/shared/components/PageTitle';
import { QueryErrorState } from '@/shared/components/QueryErrorState';
import { StatusPanel } from '@/shared/components/StatusPanel';
import { SearchOffIcon } from '@/shared/icons/icons';
import { DexNeighbours } from '../components/DexNeighbours';
import { PokemonDetailSkeleton } from '../components/PokemonDetailSkeleton';
import { PokemonProfile } from '../components/PokemonProfile';
import { StatBars } from '../components/StatBars';
import { usePokemon } from '../hooks/usePokemon';
import { usePokemonSpecies } from '../hooks/usePokemonSpecies';
import { pokemonPaths, UNIVERSE_NAME } from '../paths';
import { formatPokemonName } from '../utils/format';
import { pickLocalized } from '../utils/localized';
import styles from './PokemonDetailPage.module.css';

function parsePokedexNumber(value: string | undefined): number | undefined {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : undefined;
}

export function PokemonDetailPage() {
  const { t } = useTranslation('pokemon');
  const id = parsePokedexNumber(useParams().pokemonId);

  return (
    <>
      <BackLink to={pokemonPaths.pokedex} label={t('detail.back')} />
      {/* Invalid ids never reach the API. Keyed so state resets when browsing neighbours. */}
      {id === undefined ? <PokemonNotFound /> : <PokemonDetail key={id} id={id} />}
    </>
  );
}

function PokemonDetail({ id }: { id: number }) {
  const { t, i18n } = useTranslation('pokemon');
  // Usually instant: the listing card already loaded (and cached) this Pokémon.
  const {
    data: pokemon,
    error,
    fetchStatus,
    isPending,
    isError,
    isFetching,
    refetch,
  } = usePokemon(id);
  // Localized extras; the page doesn't depend on them to render.
  const { data: species } = usePokemonSpecies(id);

  if (isPending) {
    return fetchStatus === 'paused' ? (
      <OfflineState headingLevel="h1" />
    ) : (
      <PokemonDetailSkeleton />
    );
  }

  if (isError) {
    if (isHttpError(error, 404)) return <PokemonNotFound />;
    return (
      <QueryErrorState
        error={error}
        onRetry={() => void refetch()}
        isRetrying={isFetching}
        title={t('errors.title')}
        headingLevel="h1"
      />
    );
  }

  const name =
    (species && pickLocalized(species.names, i18n.resolvedLanguage)) ||
    formatPokemonName(pokemon.name);

  return (
    <>
      <PageTitle parts={[name, UNIVERSE_NAME]} />

      <PokemonProfile pokemon={pokemon} species={species} />

      <section aria-labelledby="pk-stats-title">
        <h2 id="pk-stats-title" className={styles.sectionTitle}>
          {t('stats.title')}
        </h2>
        <StatBars stats={pokemon.stats} />
      </section>

      <DexNeighbours id={id} />
    </>
  );
}

function PokemonNotFound() {
  const { t } = useTranslation('pokemon');

  return (
    <>
      <PageTitle parts={[t('detail.notFoundTitle'), UNIVERSE_NAME]} />
      <StatusPanel
        headingLevel="h1"
        icon={<SearchOffIcon size={24} />}
        title={t('detail.notFoundTitle')}
        description={t('detail.notFoundDescription')}
        actions={<ButtonLink to={pokemonPaths.pokedex}>{t('detail.browse')}</ButtonLink>}
      />
    </>
  );
}
