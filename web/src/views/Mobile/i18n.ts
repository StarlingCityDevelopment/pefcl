import { type Language, getI18nResources } from '@utils/i18nResourceHelpers';
import type { i18n } from 'i18next';

export const loadPefclResources = (i18n: i18n) => {
  const resources = getI18nResources();

  Object.keys(resources).forEach((lng) => {
    i18n.addResourceBundle(lng, 'pefcl', resources[lng as Language]);
  });

  return i18n;
};
