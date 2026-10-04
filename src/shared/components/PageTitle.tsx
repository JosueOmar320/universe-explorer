import { useTranslation } from 'react-i18next';

/**
 * Sets the document title as "Part · Part · App name". React 19 hoists `<title>` into
 * `<head>`, so pages can render this anywhere.
 */
export function PageTitle({ parts = [] }: { parts?: readonly string[] }) {
  const { t } = useTranslation();
  return <title>{[...parts, t('app.name')].join(' · ')}</title>;
}
