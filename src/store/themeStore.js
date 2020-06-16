import React, { createContext, useState } from 'react';

const themeStore = createContext();
const { Provider } = themeStore;

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  }

  return (
    <Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </Provider>
  );
};

export { themeStore, ThemeProvider };
