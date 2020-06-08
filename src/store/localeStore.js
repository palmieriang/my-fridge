import React, { createContext, useMemo, useState } from 'react';
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';

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

    const localizationContext = useMemo(
      () => ({
        t: (scope, options) => loadLocale.t(scope, { locale, ...options }),
        locale,
        setLocale,
      }),
      [locale]
    );

    return (
        <Provider value={{ locale, setLocale, localizationContext }}>
            <Consumer>
                {children}
            </Consumer>
        </Provider>
    );
};

export { localeStore, LocaleProvider };
