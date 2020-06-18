import React, { createContext, useState, useContext, useEffect } from 'react';
import { authStore } from './authStore';
import { firebase } from '../firebase/config';

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

const changeFirebaseTheme = (userId, theme) => {
  const userRef = firebase.firestore().collection('users');
  const data = {
    theme
  };
  userRef
    .doc(userId)
    .set(data, { merge: true })
    .catch(error => console.log('Error: ', error));
}

const themeStore = createContext(themes.lightRed);
const { Provider, Consumer } = themeStore;

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(themes.lightRed);

  const { userData } = useContext(authStore);
  const themeFromFirebase = userData.theme;

  const toggleTheme = (chosenTheme) => {
    setTheme(themes[chosenTheme.value]);
    changeFirebaseTheme(userData.id, chosenTheme.value);
  }

  useEffect(() => {
    if (themeFromFirebase) {
      setTheme(themes[themeFromFirebase]);
    }
  }, [themeFromFirebase]);

  return (
    <Provider value={{ theme, setTheme, toggleTheme }}>
      <Consumer>
        {children}
      </Consumer>
    </Provider>
  );
};

export { themeStore, ThemeProvider };
