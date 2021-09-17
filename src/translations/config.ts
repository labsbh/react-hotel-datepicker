import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// noinspection JSIgnoredPromiseFromCall
if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    defaultNS: 'hoteldatepicker',
    lng: 'en',
    resources: {},
    interpolation: {
      escapeValue: true,
    },
  });
}

export default i18n;
