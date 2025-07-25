import { getLocales } from "expo-localization";
import { I18n } from "i18n-js";
import { createContext, useMemo, useState, useContext, useEffect } from "react";

import { authStore } from "./authStore";
import {
  LocalizationContextProps,
  LocaleProviderProps,
  SupportedLocale,
  TranslateOptions,
} from "./types";
import { changeLanguage } from "../../api/api";
import { en, es, fr, it, pt } from "../localization";

const deviceLocales = getLocales();
const deviceLocale = (deviceLocales[0]?.languageCode ||
  "en") as SupportedLocale;

const i18n = new I18n({
  en,
  es,
  fr,
  it,
  pt,
});
i18n.enableFallback = true;

const defaultLocale: SupportedLocale = "en";

const defaultLocalizationContext: LocalizationContextProps = {
  t: (scope: string) => scope,
  locale: defaultLocale,
  setLocale: () => {},
  changeLocale: async () => {},
};

const localeStore = createContext<{
  locale: SupportedLocale;
  setLocale: React.Dispatch<React.SetStateAction<SupportedLocale>>;
  localizationContext: LocalizationContextProps;
}>({
  locale: defaultLocale,
  setLocale: () => {},
  localizationContext: defaultLocalizationContext,
});

const { Provider } = localeStore;

const LocaleProvider = ({ children }: LocaleProviderProps) => {
  const { userData } = useContext(authStore);
  const localeFromFirebase = userData?.locale as SupportedLocale | undefined;

  const [locale, setLocale] = useState<SupportedLocale>(deviceLocale);

  useEffect(() => {
    if (localeFromFirebase) {
      setLocale(localeFromFirebase);
    }
  }, [localeFromFirebase]);

  const localizationContext = useMemo<LocalizationContextProps>(
    () => ({
      t: (scope: string, options?: TranslateOptions) =>
        i18n.t(scope, { ...options, locale }),
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
