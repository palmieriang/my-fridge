import React, { createContext, useState, useContext, useEffect } from 'react';
import { authStore } from './authStore';

const themes = {
  lightRed: {
    foreground: '#ffffff',
    background: '#F3F3F3',
    text: 'black',
    primary: '#e74c3c',
  },
  lightBlue: {
    foreground: '#ffffff',
    background: '#F3F3F3',
    text: 'black',
    primary: '#48bbec',
  },
  darkRed: {
    foreground: '#242424',
    background: '#131313',
    text: 'white',
    primary: '#e74c3c',
  },
  darkBlue: {
    foreground: '#242424',
    background: '#131313',
    text: 'white',
    primary: '#48bbec',
  },
};

const themeStore = createContext(themes.lightRed);
const { Provider } = themeStore;

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(themes.lightRed);

  const { userData } = useContext(authStore);
  const themeFromFirebase = userData.theme;

  const toggleTheme = () => {
    setTheme(theme => (
      theme === themes.darkRed
        ? themes.lightRed
        : themes.darkRed
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
