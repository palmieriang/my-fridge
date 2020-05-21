import React, { createContext } from 'react';
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';

export const LocalizationContext = createContext();

export const en = {
  foo: 'Foo',
  bar: 'Bar {{someValue}}',
  product: 'Product name',
  date: 'Expiring date',
  place: 'Where do you want to add it?',
  add: 'Add',
  delete: 'Delete'
};

export const it = {
  foo: 'Fou',
  bar: 'Bár {{someValue}}',
  product: 'Nome del prodotto',
  date: 'Data di scadenza',
  place: 'Dove vuoi aggiungerlo?',
  add: 'Aggiungi',
  delete: 'Rimuovi'
};

i18n.fallbacks = true;
i18n.translations = { it, en };
i18n.locale = Localization.locale;

// This will log 'en' for me, as I'm an English speaker
console.log(Localization.locale);

export const loadLocale = i18n;
