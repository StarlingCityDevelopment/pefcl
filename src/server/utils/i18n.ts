import 'dayjs/locale/sv';
import languages from '@locales/index';
import { mainLogger } from '@server/sv_logger';
import { config } from '@utils/server-config';
import dayjs from 'dayjs';
import i18next from 'i18next';

const language = config?.general?.language ?? 'en';
const logger = mainLogger.child({ module: 'i18n' });

export type Namespace = 'translation' | 'pefcl';
export type LanguageContent = (typeof languages)['en'];
export type Language = keyof typeof languages;
export type Locale = Record<Language, LanguageContent>;
export type Resource = Record<Language, Record<Namespace, LanguageContent>>;

export const getI18nResources = () => {
  return languages;
};

export const getI18nResourcesNamespaced = (namespace: Namespace) => {
  return Object.keys(languages).reduce((prev, key) => {
    prev[key as Language] = {
      [namespace]: languages[key as Language],
    } as Record<Namespace, LanguageContent>;
    return prev;
  }, {} as Resource);
};

dayjs.locale(language);

export const load = async () => {
  logger.debug(`Loading language from config: ${language}`);
  const resources = getI18nResourcesNamespaced('translation');

  await i18next
    .init({
      resources,
      lng: language,
      fallbackLng: 'en',
    })
    .catch((r) => console.error(r));
};

export type TranslateFunction = (typeof i18next)['t'];

export default i18next;
