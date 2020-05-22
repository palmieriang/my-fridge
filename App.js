import 'react-native-gesture-handler';
import React, {
  useState,
  useMemo
} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { YellowBox } from 'react-native';
import { loadLocale, LocalizationContext } from './src/localization/localization'
import {
  FridgeStackScreen,
  FreezerStackScreen,
  SettingsStackScreen
} from './src/navigation/navigation';

YellowBox.ignoreWarnings([
  'Warning: componentWillMount is deprecated',
  'Warning: componentWillReceiveProps has been renamed',
]);

const Tab = createBottomTabNavigator();

export default function App() {
  const [locale, setLocale] = useState(loadLocale.locale);
  const localizationContext = useMemo(
    () => ({
      t: (scope, options) => loadLocale.t(scope, { locale, ...options }),
      locale,
      setLocale,
    }),
    [locale]
  );

  return (
    <LocalizationContext.Provider value={localizationContext}>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name={localizationContext.t('fridge')} component={FridgeStackScreen} />
          <Tab.Screen name="Freezer" component={FreezerStackScreen} />
          <Tab.Screen name={localizationContext.t('settings')} component={SettingsStackScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </LocalizationContext.Provider>
  );
}
