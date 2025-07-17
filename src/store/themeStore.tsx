import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
} from "react";

import { authStore } from "./authStore";
import {
  ThemeType,
  ThemesMap,
  ThemeContextMethods,
  ThemeStoreValue,
} from "./types";
import { changeColor } from "../../api/api";

const themes: ThemesMap = {
  lightRed: {
    foreground: "#ffffff",
    background: "#F3F3F3",
    text: "black",
    primary: "#e74c3c",
  },
  lightBlue: {
    foreground: "#ffffff",
    background: "#F3F3F3",
    text: "black",
    primary: "#48bbec",
  },
  darkRed: {
    foreground: "#242424",
    background: "#131313",
    text: "white",
    primary: "#e74c3c",
  },
  darkBlue: {
    foreground: "#242424",
    background: "#131313",
    text: "white",
    primary: "#48bbec",
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

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
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
