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
};

const themeStore = createContext<ThemeStoreValue>({
  theme: themes.lightRed,
  setTheme: () => {},
  themeName: "lightRed",
  themeContext: {
    changeTheme: () => {},
  },
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
        changeColor(newTheme, id)
          .then(() => {
            if (themes[newTheme as keyof ThemesMap]) {
              setTheme(themes[newTheme as keyof ThemesMap]);
              setThemeName(newTheme);
            } else {
              console.error(`Attempted to set unknown theme: ${newTheme}`);
            }
          })
          .catch((error: any) => console.log("Error changing theme: ", error));
      },
    }),
    [],
  );

  return (
    <Provider value={{ theme, setTheme, themeName, themeContext }}>
      {children}
    </Provider>
  );
};

export { themeStore, ThemeProvider };
