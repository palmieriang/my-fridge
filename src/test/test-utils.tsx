import { render, RenderOptions } from "@testing-library/react-native";
import { ReactElement, ReactNode, Dispatch } from "react";

import {
  ThemeStoreContext as themeStore,
  LocaleStoreContext as localeStore,
  ProductsStoreContext as productsStore,
  AuthStoreContext as authStore,
  NotificationStoreContext as notificationStore,
} from "../store/contexts";
import {
  SupportedLocale,
  AuthStateType,
  AuthContextMethods,
  ThemeStoreValue,
  NotificationStoreValue,
} from "../store/types";

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

const mockLocalizationContext = {
  t: (scope: string) => scope,
  locale: "en" as SupportedLocale,
  setLocale: jest.fn() as Dispatch<any>,
  changeLocale: jest.fn(),
};

const mockAuthState: AuthStateType = {
  user: { uid: "test-user-id" },
  isLoading: false,
  userToken: "mock-token",
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

const mockProductsContext = {
  handleSaveProduct: jest.fn(),
  handleGetProduct: jest.fn(),
  handleModifyProduct: jest.fn(),
  handleDeleteProduct: jest.fn(),
  handleFreezeProduct: jest.fn(),
};

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
      value={
        {
          authState: mockAuthState,
          dispatch: jest.fn(),
          authContext: mockAuthContext,
          userData: { locale: "en" },
        } as any
      }
    >
      <themeStore.Provider value={mockThemeStoreValue as any}>
        <localeStore.Provider value={mockLocalizationContext as any}>
          <productsStore.Provider
            value={
              {
                productsList: [],
                fridgeProducts: [],
                freezerProducts: [],
                productsContext: mockProductsContext,
              } as any
            }
          >
            <notificationStore.Provider
              value={mockNotificationStoreValue as any}
            >
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
