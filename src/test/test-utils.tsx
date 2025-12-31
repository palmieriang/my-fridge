import { render, RenderOptions } from "@testing-library/react-native";
import { ReactElement, ReactNode } from "react";

import {
  themeStore,
  localeStore,
  productsStore,
  authStore,
  notificationStore,
} from "../store";
import {
  SupportedLocale,
  AuthStateType,
  AuthContextMethods,
  ThemeStoreValue,
  NotificationStoreValue,
} from "../store/types";

// Mock theme values
const mockThemeStoreValue: ThemeStoreValue = {
  theme: {
    foreground: "#FFFFFF",
    background: "#F5F5F5",
    text: "#000000",
    primary: "#e74c3c",
  },
  setTheme: jest.fn(),
  themeName: "lightRed",
  themeContext: {
    changeTheme: jest.fn(),
  },
  availableThemes: ["lightRed", "lightBlue", "lightGreen"],
};

// Mock locale values
const mockLocalizationContext = {
  t: (scope: string) => scope,
  locale: "en" as SupportedLocale,
  setLocale: jest.fn(),
  changeLocale: jest.fn(),
};

// Mock auth values
const mockAuthState: AuthStateType = {
  user: null,
  isLoading: false,
  userToken: null,
  profileImg: null,
};

const mockAuthContext: AuthContextMethods = {
  signIn: jest.fn(),
  signInGoogle: jest.fn(),
  signOut: jest.fn(),
  signUp: jest.fn(),
  resetPassword: jest.fn(),
  updateProfileImage: jest.fn(),
  deleteImage: jest.fn(),
  deleteUser: jest.fn(),
};

// Mock products values
const mockProductsContext = {
  handleSaveProduct: jest.fn(),
  handleGetProduct: jest.fn(),
  handleModifyProduct: jest.fn(),
  handleDeleteProduct: jest.fn(),
  handleFreezeProduct: jest.fn(),
};

// Mock notification values
const mockNotificationStoreValue: NotificationStoreValue = {
  notificationState: {
    notificationsEnabled: false,
    loading: false,
  },
  notificationContext: {
    loadNotificationSettings: jest.fn(),
    setNotificationsEnabled: jest.fn(),
    toggleNotifications: jest.fn(),
    showNotificationPermissionDialog: jest.fn(),
  },
};

interface AllProvidersProps {
  children: ReactNode;
}

const AllProviders = ({ children }: AllProvidersProps) => {
  return (
    <authStore.Provider
      value={{
        authState: mockAuthState,
        dispatch: jest.fn(),
        authContext: mockAuthContext,
        userData: null,
      }}
    >
      <themeStore.Provider value={mockThemeStoreValue}>
        <localeStore.Provider
          value={{
            locale: "en" as SupportedLocale,
            setLocale: jest.fn(),
            localizationContext: mockLocalizationContext,
          }}
        >
          <productsStore.Provider
            value={{
              productsList: [],
              fridgeProducts: [],
              freezerProducts: [],
              productsContext: mockProductsContext,
            }}
          >
            <notificationStore.Provider value={mockNotificationStoreValue}>
              {children}
            </notificationStore.Provider>
          </productsStore.Provider>
        </localeStore.Provider>
      </themeStore.Provider>
    </authStore.Provider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => render(ui, { wrapper: AllProviders, ...options });

// Re-export everything from testing library
export * from "@testing-library/react-native";

// Override render with custom render
export { customRender as render };
