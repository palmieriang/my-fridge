import { getLocales } from "expo-localization";
import { I18n } from "i18n-js";
import React, {
  createContext,
  useMemo,
  useState,
  useContext,
  useEffect,
} from "react";

import { authStore } from "./authStore";
import { changeLanguage } from "../../api/api";

const en = require("../localization/en.json");
const es = require("../localization/es.json");
const fr = require("../localization/fr.json");
const it = require("../localization/it.json");
const pt = require("../localization/pt.json");

const deviceLocales = getLocales();
const deviceLocale = deviceLocales[0].languageCode || "en";

const i18n = new I18n();
i18n.translations = { en, es, fr, it, pt };
i18n.fallbacks = true;

const localeStore = createContext();
const { Provider } = localeStore;

const LocaleProvider = ({ children }) => {
  const { userData } = useContext(authStore);
  const localeFromFirebase = userData.locale;

  const [locale, setLocale] = useState(deviceLocale);

  useEffect(() => {
    if (localeFromFirebase) {
      setLocale(localeFromFirebase);
    }
  }, [localeFromFirebase]);

  const localizationContext = useMemo(
    () => ({
      t: (scope, options) => i18n.t(scope, { ...options, locale }),
      locale,
      setLocale,
      changeLocale: async ({ newLocale, id }) => {
        changeLanguage(newLocale, id)
          .then(() => {
            setLocale(newLocale);
          })
          .catch((error) => console.log("Error: ", error));
      },
    }),
    [locale],
  );

  return (
    <Provider value={{ locale, setLocale, localizationContext }}>
      {children}
    </Provider>
  );
};

export { localeStore, LocaleProvider };
