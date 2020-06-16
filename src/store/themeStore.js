import React, { createContext, useState } from 'react';

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

  const toggleTheme = () => {
    setTheme(theme => (
      theme === themes.dark
        ? themes.light
        : themes.dark
    ));
  }

  return (
    <Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </Provider>
  );
};

export { themeStore, ThemeProvider };
