import {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
  ReactNode,
} from "react";

import { authStore } from "./authStore";
import {
  ThemeType,
  ThemesMap,
  ThemeContextMethods,
  ThemeStoreValue,
} from "./types";
import { changeColor } from "../../api/api";
import { COLORS } from "../constants/colors";

const themes: ThemesMap = {
  lightRed: {
    foreground: COLORS.WHITE,
    background: COLORS.LIGHT_BACKGROUND,
    text: COLORS.BLACK,
    primary: COLORS.PRIMARY_RED,
  },
  lightBlue: {
    foreground: COLORS.WHITE,
    background: COLORS.LIGHT_BACKGROUND,
    text: COLORS.BLACK,
    primary: COLORS.PRIMARY_BLUE,
  },
  lightGreen: {
    foreground: COLORS.WHITE,
    background: COLORS.LIGHT_BACKGROUND,
    text: COLORS.BLACK,
    primary: COLORS.PRIMARY_GREEN,
  },
  lightPurple: {
    foreground: COLORS.WHITE,
    background: COLORS.LIGHT_BACKGROUND,
    text: COLORS.BLACK,
    primary: COLORS.PRIMARY_PURPLE,
  },
  lightOrange: {
    foreground: COLORS.WHITE,
    background: COLORS.LIGHT_BACKGROUND,
    text: COLORS.BLACK,
    primary: COLORS.PRIMARY_ORANGE,
  },
  lightTeal: {
    foreground: COLORS.WHITE,
    background: COLORS.LIGHT_BACKGROUND,
    text: COLORS.BLACK,
    primary: COLORS.PRIMARY_TEAL,
  },
  darkRed: {
    foreground: COLORS.DARK_FOREGROUND,
    background: COLORS.DARK_BACKGROUND,
    text: COLORS.WHITE,
    primary: COLORS.PRIMARY_RED,
  },
  darkBlue: {
    foreground: COLORS.DARK_FOREGROUND,
    background: COLORS.DARK_BACKGROUND,
    text: COLORS.WHITE,
    primary: COLORS.PRIMARY_BLUE,
  },
  darkGreen: {
    foreground: COLORS.DARK_FOREGROUND,
    background: COLORS.DARK_BACKGROUND,
    text: COLORS.WHITE,
    primary: COLORS.PRIMARY_GREEN,
  },
  darkPurple: {
    foreground: COLORS.DARK_FOREGROUND,
    background: COLORS.DARK_BACKGROUND,
    text: COLORS.WHITE,
    primary: COLORS.PRIMARY_PURPLE,
  },
  darkOrange: {
    foreground: COLORS.DARK_FOREGROUND,
    background: COLORS.DARK_BACKGROUND,
    text: COLORS.WHITE,
    primary: COLORS.PRIMARY_ORANGE,
  },
  darkTeal: {
    foreground: COLORS.DARK_FOREGROUND,
    background: COLORS.DARK_BACKGROUND,
    text: COLORS.WHITE,
    primary: COLORS.PRIMARY_TEAL,
  },
};

const AVAILABLE_THEMES = Object.keys(themes);

const themeStore = createContext<ThemeStoreValue>({
  theme: themes.lightRed,
  setTheme: () => {},
  themeName: "lightRed",
  themeContext: {
    changeTheme: () => {},
  },
  availableThemes: AVAILABLE_THEMES,
});

const { Provider } = themeStore;

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [themeName, setThemeName] = useState<string>("lightRed");
  const [theme, setTheme] = useState<ThemeType>(themes.lightRed);
  const {
    userData: { theme: themeFromFirebase },
  } = useContext(authStore);

  useEffect(() => {
    if (themeFromFirebase) {
      if (themes[themeFromFirebase as keyof ThemesMap]) {
        setTheme(themes[themeFromFirebase as keyof ThemesMap]);
        setThemeName(themeFromFirebase);
      } else {
        console.warn(`Theme "${themeFromFirebase}" not found in themes map.`);
      }
    }
  }, [themeFromFirebase]);

  const themeContext: ThemeContextMethods = useMemo(
    () => ({
      changeTheme: ({ newTheme, id }) => {
        if (themes[newTheme as keyof ThemesMap]) {
          setTheme(themes[newTheme as keyof ThemesMap]);
          setThemeName(newTheme);
        } else {
          console.error(`Attempted to set unknown theme: ${newTheme}`);
          return;
        }
        changeColor(newTheme, id).catch((error: unknown) =>
          console.warn(
            "[Theme] Failed to sync to Firestore (will retry when online):",
            error,
          ),
        );
      },
    }),
    [],
  );

  return (
    <Provider
      value={{
        theme,
        setTheme,
        themeName,
        themeContext,
        availableThemes: AVAILABLE_THEMES,
      }}
    >
      {children}
    </Provider>
  );
};

export { themeStore, ThemeProvider };
