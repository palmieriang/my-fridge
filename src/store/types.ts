import { Timestamp } from "@react-native-firebase/firestore";
import { ReactNode } from "react";

// authStore

export interface AuthStateType {
  isLoading: boolean;
  user: any | null;
  userToken: string | null;
  profileImg: string | null;
}

export interface AuthContextMethods {
  signIn: ({ email, password }: { email: string; password: string }) => void;
  signInGoogle: () => void;
  signOut: (dispatch: React.Dispatch<any>) => void;
  signUp: ({
    fullName,
    email,
    password,
    confirmPassword,
  }: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfileImage: (url: string) => void;
  deleteImage: (id: string) => void;
  deleteUser: () => void;
}

export interface AuthStoreValue {
  authState: AuthStateType;
  dispatch: React.Dispatch<any>;
  authContext: AuthContextMethods;
  userData: any;
}

export interface UserData {
  id: string;
  email: string;
  fullName: string;
  locale: string;
  theme: string;
  profileImg?: string;
}

// localeStore

export type SupportedLocale = "en" | "es" | "fr" | "it" | "pt" | "de";

export type TranslateOptions = Record<string, unknown>;

export interface LocalizationContextProps {
  t: (scope: string, options?: TranslateOptions) => string;
  locale: SupportedLocale;
  setLocale: React.Dispatch<React.SetStateAction<SupportedLocale>>;
  changeLocale: (params: {
    newLocale: SupportedLocale;
    id: string;
  }) => Promise<void>;
}

export interface LocaleProviderProps {
  children: ReactNode;
}

// productsStore

export interface Product {
  id: string;
  name: string;
  date: string;
  place: "fridge" | "freezer";
  authorID: string;
  createdAt?: Timestamp;
}

export type NewProduct = Omit<Product, "id" | "createdAt">;

export interface ProductsContextMethods {
  handleSaveProduct: (data: NewProduct) => Promise<void>;
  handleGetProduct: (id: string) => Promise<Product | undefined>;
  handleModifyProduct: (data: NewProduct, id: string) => Promise<void>;
  handleDeleteProduct: (id: string) => Promise<void>;
  handleFreezeProduct: (id: string, place: "fridge" | "freezer") => void;
}

export interface ProductsStoreValue {
  productsList: Product[];
  fridgeProducts: Product[];
  freezerProducts: Product[];
  productsContext: ProductsContextMethods;
}

// themeStore

export interface ThemeType {
  foreground: string;
  background: string;
  text: string;
  primary: string;
}

export interface ThemesMap {
  [key: string]: ThemeType;
}

export interface ThemeContextMethods {
  changeTheme: ({ newTheme, id }: { newTheme: string; id: string }) => void;
}

export interface ThemeStoreValue {
  theme: ThemeType;
  setTheme: React.Dispatch<React.SetStateAction<ThemeType>>;
  themeName: string;
  themeContext: ThemeContextMethods;
}
