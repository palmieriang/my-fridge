import React from 'react';
import PropTypes from 'prop-types';
import { render as rtlRender, screen } from '@testing-library/react-native';
import { AuthProvider } from '../src/store/authStore';
import { LocaleProvider } from '../src/store/localeStore';
import { ThemeProvider } from '../src/store/themeStore';
import { ProductsProvider } from '../src/store/productsStore';

jest.mock('../src/firebase/config.js', () => {
  const firebasemock = require('firebase-mock');

  const mockdatabase = new firebasemock.MockFirebase();
  const mockauth = new firebasemock.MockFirebase();
  const mocksdk = new firebasemock.MockFirebaseSdk(
    (path) => {
      null;
    },
    () => {
      return mockauth;
    }
  );
  const mockfirestore = new firebasemock.MockFirestore();

  const firebase = mocksdk.initializeApp(); // can take a path arg to database url

  // return the mock to match your export api
  return {
    auth: mockauth,
    database: mockdatabase,
    firestore: mockfirestore,
  };
});

const authState = {
  userToken: `eyJhbGciOiJSUzI1NiIsImtpZCI6ImI5ODI2ZDA5Mzc3N2NlMDA1ZTQzYTMyN2ZmMjAyNjUyMTQ1ZTk2MDQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vbXktbmF0aXZlLWZyaWRnZSIsImF1ZCI6Im15LW5hdGl2ZS1mcmlkZ2UiLCJhdXRoX3RpbWUiOjE2MDY5OTcyNjAsInVzZXJfaWQiOiJGWUhkTnRVOTlSUk9TNzhwVTFYUDRTeVlhTkoyIiwic3ViIjoiRllIZE50VTk5UlJPUzc4cFUxWFA0U3lZYU5KMiIsImlhdCI6MTYwNzA5ODQ5NSwiZXhwIjoxNjA3MTAyMDk1LCJlbWFpbCI6InBhbG1pZXJpLmFuZ0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJwYWxtaWVyaS5hbmdAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.K9RNWl5Ore7IT_yr7tyQMAqhmuVE0O6J8y52Sx6bVaN3TEhu_5Mp6xLANYPEs8Bq3Kav5514u30MrwwvifxqpjYgF2lKqSS0GpUnaxFZ-7CucThYT8oCjZWjLj9u3WSkZFckus7XXiCnmROZfZiZmXFeP5BmJTma35XqP3F9AiaiopkqCGIxmxSrAE9ErwAVzcuyUafMolC7tCZ9bYMOeTJbPG2UKTSmc703m2idvbGdyLV_GZ--Syz_YZn6k2ovJvPKj-I46dLvOwkzHWzefPXHoyBiCl98wHnzmTG3NnsStyQp2L0frGtvAg2qyP7ZbOW7drRlIIrp-1UTnWbjegeyJhbGciOiJSUzI1NiIsImtpZCI6ImI5ODI2ZDA5Mzc3N2NlMDA1ZTQzYTMyN2ZmMjAyNjUyMTQ1ZTk2MDQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vbXktbmF0aXZlLWZyaWRnZSIsImF1ZCI6Im15LW5hdGl2ZS1mcmlkZ2UiLCJhdXRoX3RpbWUiOjE2MDY5OTcyNjAsInVzZXJfaWQiOiJGWUhkTnRVOTlSUk9TNzhwVTFYUDRTeVlhTkoyIiwic3ViIjoiRllIZE50VTk5UlJPUzc4cFUxWFA0U3lZYU5KMiIsImlhdCI6MTYwNzA5ODQ5NSwiZXhwIjoxNjA3MTAyMDk1LCJlbWFpbCI6InBhbG1pZXJpLmFuZ0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJwYWxtaWVyaS5hbmdAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.K9RNWl5Ore7IT_yr7tyQMAqhmuVE0O6J8y52Sx6bVaN3TEhu_5Mp6xLANYPEs8Bq3Kav5514u30MrwwvifxqpjYgF2lKqSS0GpUnaxFZ-7CucThYT8oCjZWjLj9u3WSkZFckus7XXiCnmROZfZiZmXFeP5BmJTma35XqP3F9AiaiopkqCGIxmxSrAE9ErwAVzcuyUafMolC7tCZ9bYMOeTJbPG2UKTSmc703m2idvbGdyLV_GZ--Syz_YZn6k2ovJvPKj-I46dLvOwkzHWzefPXHoyBiCl98wHnzmTG3NnsStyQp2L0frGtvAg2qyP7ZbOW7drRlIIrp-1UTnWbjegeyJhbGciOiJSUzI1NiIsImtpZCI6ImI5ODI2ZDA5Mzc3N2NlMDA1ZTQzYTMyN2ZmMjAyNjUyMTQ1ZTk2MDQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vbXktbmF0aXZlLWZyaWRnZSIsImF1ZCI6Im15LW5hdGl2ZS1mcmlkZ2UiLCJhdXRoX3RpbWUiOjE2MDY5OTcyNjAsInVzZXJfaWQiOiJGWUhkTnRVOTlSUk9TNzhwVTFYUDRTeVlhTkoyIiwic3ViIjoiRllIZE50VTk5UlJPUzc4cFUxWFA0U3lZYU5KMiIsImlhdCI6MTYwNzEwNDgwMCwiZXhwIjoxNjA3MTA4NDAwLCJlbWFpbCI6InBhbG1pZXJpLmFuZ0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJwYWxtaWVyaS5hbmdAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.J0Y2YJN7Ed5HUoD3a1vrJDVOxxZAUlIaqdFCPs5uGBPLrVi7BeRGiRDa757-NSAPtiSh_jQebzOJBDtGld-iiS4rZdu7j7_jT9N09hxEFtjWQEhx5XV8USgNhi1JpVUDHUqyI_xU96qSZa5qDr16u4VF-sOvajHHSzTuLdKNALk44uZ2P5Dr4RsjCDnIMECV1jMCqvkXy-Kp4MTfVLhEJOZWNDVaSbsA-LrfXpToTafkgpDTVsawFt2f-f_rovaZwOV1DhZ4iD2DeEupJXoQ6jW2GsjtQF3C6_qJx_lA5p7GP70CY1_nTOKcZH3jspq_JfiQRK8SmRp7TqhZn8hVJQeyJhbGciOiJSUzI1NiIsImtpZCI6ImI5ODI2ZDA5Mzc3N2NlMDA1ZTQzYTMyN2ZmMjAyNjUyMTQ1ZTk2MDQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vbXktbmF0aXZlLWZyaWRnZSIsImF1ZCI6Im15LW5hdGl2ZS1mcmlkZ2UiLCJhdXRoX3RpbWUiOjE2MDY5OTcyNjAsInVzZXJfaWQiOiJGWUhkTnRVOTlSUk9TNzhwVTFYUDRTeVlhTkoyIiwic3ViIjoiRllIZE50VTk5UlJPUzc4cFUxWFA0U3lZYU5KMiIsImlhdCI6MTYwNzEwNDgwMCwiZXhwIjoxNjA3MTA4NDAwLCJlbWFpbCI6InBhbG1pZXJpLmFuZ0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJwYWxtaWVyaS5hbmdAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.J0Y2YJN7Ed5HUoD3a1vrJDVOxxZAUlIaqdFCPs5uGBPLrVi7BeRGiRDa757-NSAPtiSh_jQebzOJBDtGld-iiS4rZdu7j7_jT9N09hxEFtjWQEhx5XV8USgNhi1JpVUDHUqyI_xU96qSZa5qDr16u4VF-sOvajHHSzTuLdKNALk44uZ2P5Dr4RsjCDnIMECV1jMCqvkXy-Kp4MTfVLhEJOZWNDVaSbsA-LrfXpToTafkgpDTVsawFt2f-f_rovaZwOV1DhZ4iD2DeEupJXoQ6jW2GsjtQF3C6_qJx_lA5p7GP70CY1_nTOKcZH3jspq_JfiQRK8SmRp7TqhZn8hVJQ`,
};
const localizationContext = {
  t: () => {},
};
const themes = {
  lightBlue: {
    foreground: '#ffffff',
    background: '#F3F3F3',
    text: 'black',
    primary: '#48bbec',
  },
};
const productsList = {
  authorID: 'FYHdNtU99RROS78pU1XP4SyYaNJ2',
  createdAt: Date.now(),
  date: new Date('2020-12-18T00:00:00.000Z'),
  id: 'FWTpJYXcOMxBr7t5IyHa',
  name: 'First product from Firestore',
  place: 'fridge',
};

function render(
  ui,
  {
    userToken = authState.userToken,
    t = localizationContext.t,
    theme = themes.lightBlue,
    products = productsList,
    ...options
  } = {}
) {
  function Wrapper({ children }) {
    return (
      <AuthProvider>
        {(userToken) => (
          <LocaleProvider>
            {(t) => (
              <ThemeProvider>
                {(theme) => (
                  <ProductsProvider>
                    {(products) => {
                      children;
                    }}
                  </ProductsProvider>
                )}
              </ThemeProvider>
            )}
          </LocaleProvider>
        )}
      </AuthProvider>
    );
  }
  Wrapper.propTypes = {
    children: PropTypes.node,
  };

  return rtlRender(ui, { wrapper: Wrapper, ...options });
}

export * from '@testing-library/react-native';
// override the built-in render with our own
export { render, screen };
