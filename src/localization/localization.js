import React, { createContext } from 'react';
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';

export const LocalizationContext = createContext();

const en = {
  title: 'My fridge',
  settings: 'Settings',
  foo: 'Foo',
  bar: 'Bar {{someValue}}',
  product: 'Product name',
  date: 'Expiring date',
  choosePlace: 'Where do you want to add it?',
  add: 'Add',
  delete: 'Delete',
  fridge: 'Fridge',
  freezer: 'Freezer',
  days: 'Days',
  hours: 'Hours',
  minutes: 'Minutes',
  seconds: 'Seconds',
  addItem: 'Add item',
};

const it = {
  title: 'Il mio frigo',
  settings: 'Impostazioni',
  foo: 'Fou',
  bar: 'Bár {{someValue}}',
  product: 'Nome del prodotto',
  date: 'Data di scadenza',
  choosePlace: 'Dove vuoi aggiungerlo?',
  add: 'Aggiungi',
  delete: 'Rimuovi',
  fridge: 'Frigo',
  freezer: 'Freezer',
  days: 'Giorni',
  hours: 'Ore',
  minutes: 'Minuti',
  seconds: 'Secondi',
  addItem: 'Aggiungi',
};

i18n.fallbacks = true;
i18n.translations = { it, en };
i18n.locale = Localization.locale;

// This will log 'en' for me, as I'm an English speaker
console.log(Localization.locale);

export const loadLocale = i18n;
