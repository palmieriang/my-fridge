import { createContext } from "react";

import {
  AuthStoreValue,
  ThemeStoreValue,
  ProductsStoreValue,
  NotificationStoreValue,
  LocalizationContextProps,
} from "./types";

export const AuthStoreContext = createContext<AuthStoreValue | undefined>(
  undefined,
);
export const ThemeStoreContext = createContext<ThemeStoreValue | undefined>(
  undefined,
);
export const ProductsStoreContext = createContext<
  ProductsStoreValue | undefined
>(undefined);
export const NotificationStoreContext = createContext<
  NotificationStoreValue | undefined
>(undefined);
export const LocaleStoreContext = createContext<
  LocalizationContextProps | undefined
>(undefined);
