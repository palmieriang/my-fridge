import { useContext } from "react";

import {
  AuthStoreContext,
  ThemeStoreContext,
  ProductsStoreContext,
  NotificationStoreContext,
  LocaleStoreContext,
} from "./contexts";

export function useAuth() {
  const context = useContext(AuthStoreContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

export function useTheme() {
  const context = useContext(ThemeStoreContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}

export function useProducts() {
  const context = useContext(ProductsStoreContext);
  if (!context) {
    throw new Error("useProducts must be used within ProductsProvider");
  }
  return context;
}

export function useNotifications() {
  const context = useContext(NotificationStoreContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within NotificationProvider",
    );
  }
  return context;
}

export function useLocale() {
  const context = useContext(LocaleStoreContext);
  if (!context) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return context;
}
