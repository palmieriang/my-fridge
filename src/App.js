import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import React, {
  useEffect,
  useState,
  useMemo,
  useReducer,
  useContext,
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
// import { AuthContext } from './authentication/authentication';
import { store, AuthProvider } from './store/store';
import FreezerIcon from '../assets/freezer.svg';
import SettingsIcon from '../assets/settings.svg';

YellowBox.ignoreWarnings([
  'Warning: componentWillMount is deprecated',
  'Warning: componentWillReceiveProps has been renamed',
]);

const Tab = createBottomTabNavigator();

export default function App() {
  // authentication
  const globalState = useContext(store);
  console.log('globalState app.js ', globalState);

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
    <AuthProvider>
      <LocalizationContext.Provider value={localizationContext}>
        <NavigationContainer>
          {globalState.userToken ? (
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
    </AuthProvider>
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
