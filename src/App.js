import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import React, {
  useEffect,
  useState,
  useMemo,
  useReducer
} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AsyncStorage, StyleSheet, View, YellowBox } from 'react-native';
import { loadLocale, LocalizationContext } from './localization/localization';
import {
  FridgeStackScreen,
  FreezerStackScreen,
  SettingsStackScreen,
  SingInStackScreen
} from './navigation/navigation';
import { AuthContext } from './authentication/authentication';
import FreezerIcon from '../assets/freezer.svg';
import SettingsIcon from '../assets/settings.svg';

YellowBox.ignoreWarnings([
  'Warning: componentWillMount is deprecated',
  'Warning: componentWillReceiveProps has been renamed',
]);

const Tab = createBottomTabNavigator();

export default function App() {
  // authentication
  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    bootstrapAsync();
  }, []);

  authContext = useMemo(
    () => ({
      signIn: async data => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token

        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
      signOut: () => dispatch({ type: 'SIGN_OUT' }),
      signUp: async data => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token

        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
    }), []
  );

  // localization
  const [locale, setLocale] = useState(loadLocale.locale);
  const localizationContext = useMemo(
    () => ({
      t: (scope, options) => loadLocale.t(scope, { locale, ...options }),
      locale,
      setLocale,
    }),
    [locale]
  );

  const { t } = localizationContext;

  return (
    <AuthContext.Provider value={authContext}>
      <LocalizationContext.Provider value={localizationContext}>
        <NavigationContainer>
          {state.userToken ? (
            <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                  let IconName;
                  size = focused ? size : '22';

                  if (route.name === t('fridge') || route.name === t('freezer')) {
                    IconName = FreezerIcon;
                  } else if (route.name === t('settings')) {
                    IconName = SettingsIcon;
                  }

                  return (
                    <View style={styles.tabIcon}>
                      <IconName width={size} height={size} fill={color} />
                      {route.name === t('freezer') &&
                        <IconName width={size} height={size} fill={color} />
                      }
                    </View>
                  );
                },
              })}
              tabBarOptions={{
                activeTintColor: 'rgba(231, 76, 60, 1)',
                inactiveTintColor: 'black',
                showIcon: true,
                showLabel: true,
              }}
            >
              <Tab.Screen name={t('fridge')} component={FridgeStackScreen} />
              <Tab.Screen name={t('freezer')} component={FreezerStackScreen} />
              <Tab.Screen name={t('settings')} component={SettingsStackScreen} />
            </Tab.Navigator>
          ) : (
            <SingInStackScreen />
          )}
        </NavigationContainer>
      </LocalizationContext.Provider>
    </AuthContext.Provider>
  );
}

registerRootComponent(App);

const styles = StyleSheet.create({
  tabIcon: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  }
});