import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import type { PokemonType } from '../api/models';
import { pokemonTypeQueryOptions } from '../api/queries';
import { formatPokemonName } from '../utils/format';
import { pickLocalized } from '../utils/localized';

/**
 * Official type name in the current language, as provided by PokéAPI ("Eléctrico").
 * Until it loads (or if it fails) the API identifier is shown ("Electric"), so the
 * badge never renders empty or shifts the layout.
 */
export function useTypeName(type: PokemonType): string {
  const { i18n } = useTranslation();
  const { data: names } = useQuery({
    ...pokemonTypeQueryOptions(type),
    select: (details) => details.names,
  });

  return (names && pickLocalized(names, i18n.resolvedLanguage)) || formatPokemonName(type);
}
