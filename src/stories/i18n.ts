import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// noinspection JSIgnoredPromiseFromCall
i18n
    .use(initReactI18next)
    .init({
      defaultNS: 'hoteldatepicker',
      lng: 'fr',
      ns: ['hoteldatepicker'],
      resources: {
        fr: {
          hoteldatepicker: require('./locales/fr.json'),
        },
        en: {
          hoteldatepicker: require('./locales/en.json'),
        }
      },
      interpolation: {
        escapeValue: false,
      },
      react: {
        transKeepBasicHtmlNodesFor: ['br', 'strong', 'i'],
      },
      debug: true,
    });

export default i18n;
