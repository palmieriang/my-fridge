import React, { createContext } from 'react';
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';

export const LocalizationContext = createContext();

const en = require('./en.json');
const it = require('./it.json');

i18n.fallbacks = true;
i18n.translations = { it, en };
i18n.locale = Localization.locale;

// This will log 'en' for me, as I'm an English speaker
console.log(Localization.locale);

export const loadLocale = i18n;
