import dayjs from 'dayjs';
import i18n from 'i18next';
import 'dayjs/locale/sv';

import { getConfig } from "@utils/api";
import localizedFormat from 'dayjs/plugin/localizedFormat';
import updateLocale from 'dayjs/plugin/updateLocale';
import { getI18nResourcesNamespaced } from './i18nResourceHelpers';

dayjs.extend(updateLocale);
dayjs.extend(localizedFormat);

const getLBPhoneSettings = async () => {
  return window.GetSettings != null ? await window.GetSettings() : null;
};

const getLBTabletSettings = async () => {
  return window.GetSettings != null ? await window.GetSettings() : null;
};

const load = async () => {
  const config = await getConfig();
  const LBPhoneSettings = await getLBPhoneSettings();
  const LBTabletSettings = await getLBTabletSettings();
  const language = LBPhoneSettings?.locale ?? LBTabletSettings?.locale ?? config.general.language ?? 'en';
  const resources = getI18nResourcesNamespaced('translation');

  await i18n
    .init({
      resources,
      lng: language,
      fallbackLng: 'en',
    })
    .then(() => {})
    .catch((r) => console.error(r));

  dayjs.locale(language);
  dayjs.updateLocale(language, {
    calendar: {
      lastDay: i18n.t('calendar.lastDay'),
      sameDay: i18n.t('calendar.sameDay'),
      nextDay: i18n.t('calendar.nextDay'),
      lastWeek: i18n.t('calendar.lastWeek'),
      nextWeek: i18n.t('calendar.nextWeek'),
      sameElse: i18n.t('calendar.sameElse'),
    },
  });
};

load().catch((err) => {
  console.error('Failed to initialize i18n:', err);
});

export type TranslateFunction = (typeof i18n)['t'];

export default i18n as Omit<typeof i18n, 't'> & {
  t: (key: string, options?: any) => any;
};
