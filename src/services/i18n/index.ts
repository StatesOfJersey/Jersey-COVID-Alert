import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import * as SecureStore from 'expo-secure-store';
import { format as formatDate } from 'date-fns';

import { fallback, defaultNamespace, namespaces, supportedLocales } from './common';

const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: async (callback: (lang: string) => void) => {
    const storedLanguage = await SecureStore.getItemAsync('appLanguage');
    const lang: string = storedLanguage || Localization.locale.split('-')[0].replace('-', '');
    callback(supportedLocales[lang] ? lang : fallback);
  },
  init: () => {},
  cacheUserLanguage: () => {}
};

i18n
  // @ts-ignore
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: fallback,
    resources: supportedLocales,
    ns: namespaces,
    defaultNS: defaultNamespace,
    debug: false,
    interpolation: {
      escapeValue: false,
      format: (value: Date | string, format: string): string => {
        if (value instanceof Date && format) {
          return formatDate(value, format);
        } else return value.toString();
      }
    }
  });

export const formatNumber = (value: number): string => {
  const currentLanguage = i18n.language;
  return new Intl.NumberFormat(currentLanguage).format(value);
};

export default i18n;
