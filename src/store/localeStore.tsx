import { getLocales } from "expo-localization";
import { I18n } from "i18n-js";
import { useMemo, useState, useContext, useEffect } from "react";

import { authStore } from "./authStore";
import { LocaleStoreContext } from "./contexts";
import {
  LocaleProviderProps,
  LocalizationContextProps,
  SupportedLocale,
  TranslateOptions,
} from "./types";
import { changeLanguage } from "../../api/api";
import { de, en, es, fr, it, pt } from "../localization";

const deviceLocales = getLocales();
const deviceLocale = (deviceLocales[0]?.languageCode ||
  "en") as SupportedLocale;

const i18n = new I18n({
  de,
  en,
  es,
  fr,
  it,
  pt,
});
i18n.enableFallback = true;

const { Provider } = LocaleStoreContext;

const LocaleProvider = ({ children }: LocaleProviderProps) => {
  const authContext = useContext(authStore);
  const localeFromFirebase = authContext?.userData?.locale as
    | SupportedLocale
    | undefined;

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
      changeLocale: async ({
        newLocale,
        id,
      }: {
        newLocale: SupportedLocale;
        id: string;
      }) => {
        setLocale(newLocale);
        changeLanguage(newLocale, id).catch((error) =>
          console.warn(
            "[Locale] Failed to sync to Firestore (will retry when online):",
            error,
          ),
        );
      },
    }),
    [locale],
  );

  return <Provider value={localizationContext}>{children}</Provider>;
};

export { LocaleStoreContext as localeStore, LocaleProvider };
