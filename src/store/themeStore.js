import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
} from "react";

import { authStore } from "./authStore";
import { changeColor } from "../../api/api";

const themes = {
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

const themeStore = createContext(themes.lightRed);
const { Provider } = themeStore;

const ThemeProvider = ({ children }) => {
  const [themeName, setThemeName] = useState("lightRed");
  const [theme, setTheme] = useState(themes.lightRed);
  const {
    userData: { theme: themeFromFirebase },
  } = useContext(authStore);

  useEffect(() => {
    if (themeFromFirebase) {
      setTheme(themes[themeFromFirebase]);
      setThemeName(themeFromFirebase);
    }
  }, [themeFromFirebase]);

  const themeContext = useMemo(
    () => ({
      changeTheme: ({ newTheme, id }) => {
        changeColor(newTheme, id)
          .then(() => {
            setTheme(themes[newTheme]);
            setThemeName(newTheme);
          })
          .catch((error) => console.log("Error changing theme: ", error));
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
