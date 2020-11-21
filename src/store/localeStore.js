import React, {
  createContext,
  useMemo,
  useState,
  useContext,
  useEffect
} from 'react';
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import { authStore } from './authStore';
import { changeLanguage } from '../../api/api';

const en = require('../localization/en.json');
const it = require('../localization/it.json');
const fr = require('../localization/fr.json');

i18n.fallbacks = true;
i18n.translations = { fr, it, en };
i18n.locale = Localization.locale;

const loadLocale = i18n;

const localeStore = createContext();
const { Provider, Consumer } = localeStore;

const LocaleProvider = ({ children }) => {
  const [locale, setLocale] = useState(loadLocale.locale);

  const { userData } = useContext(authStore);
  const localeFromFirebase = userData.locale;

  useEffect(() => {
    if (localeFromFirebase) {
      setLocale(localeFromFirebase);
    }
  }, [localeFromFirebase]);

  const localizationContext = useMemo(
    () => ({
      t: (scope, options) => loadLocale.t(scope, { locale, ...options }),
      locale,
      setLocale,
      changeLocale: async ({ newLocale, id }) => {
        changeLanguage(newLocale, id)
          .then(() => {
            setLocale(newLocale);
          })
          .catch(error => console.log('Error: ', error));
      }
    }),
    [locale]
  );

  return (
    <Provider value={{ locale, setLocale, localizationContext }}>
      <Consumer>{children}</Consumer>
    </Provider>
  );
};

export { localeStore, LocaleProvider };
