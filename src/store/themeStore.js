import React, { createContext, useState, useContext, useEffect } from 'react';
import { authStore } from './authStore';

const themes = {
  light: {
    foreground: '#ffffff',
    background: '#F3F3F3',
    text: 'black',
  },
  dark: {
    foreground: '#242424',
    background: '#131313',
    text: 'white',
  },
};

const themeStore = createContext(themes.light);
const { Provider } = themeStore;

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(themes.light);

  const { userData } = useContext(authStore);
  const themeFromFirebase = userData.theme;

  const toggleTheme = () => {
    setTheme(theme => (
      theme === themes.dark
        ? themes.light
        : themes.dark
    ));
  }

  useEffect(() => {
    if (themeFromFirebase) {
      setTheme(themes[themeFromFirebase]);
    }
  }, [themeFromFirebase]);

  return (
    <Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </Provider>
  );
};

export { themeStore, ThemeProvider };
