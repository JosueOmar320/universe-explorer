import type { resources } from '@/i18n/resources';

declare module 'i18next' {
  /** Type-checks every translation key against the English resources. */
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: (typeof resources)['en'];
  }
}
