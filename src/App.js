import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import React from 'react';
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View, LogBox } from 'react-native';
import {
  FridgeStackScreen,
  FreezerStackScreen,
  SettingsStackScreen,
  SingInStackScreen,
} from './navigation/navigation';
import FreezerIcon from '@components/svg/FreezerIcon';
import SettingsIcon from '@components/svg/SettingsIcon';
import { getCountdownParts } from '../api/api';
import { customFonts } from './typography/typography';
import { AuthProvider } from './store/authStore';
import { LocaleProvider } from './store/localeStore';
import { ThemeProvider } from './store/themeStore';
import { ProductsProvider } from './store/productsStore';

LogBox.ignoreLogs([
  'Warning: componentWillMount is deprecated',
  'Warning: componentWillReceiveProps has been renamed',
  'Warning: Setting a timer',
]);

const Tab = createBottomTabNavigator();

const countExpiredItems = (productsList) => {
  if (!productsList.length) {
    return null;
  }

  let counter = null;
  for (let i = 0; i < productsList.length; i++) {
    if (productsList[i].place === 'fridge') {
      const { days } = getCountdownParts(productsList[i].date);
      if (days < 0) {
        counter++;
      }
    }
  }
  return counter;
};

export default function App() {
  const [fontsLoaded] = useFonts(customFonts);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      {({ authState: { userToken } }) => (
        <LocaleProvider>
          {({ localizationContext: { t } }) => (
            <ThemeProvider>
              {({ theme: { primary } }) => (
                <ProductsProvider>
                  {({ productsList }) => (
                    <NavigationContainer>
                      {userToken ? (
                        <Tab.Navigator
                          screenOptions={({ route }) => ({
                            tabBarIcon: ({ focused, color, size }) => {
                              let IconName;
                              size = focused ? size : '22';

                              if (
                                route.name === t('fridge') ||
                                route.name === t('freezer')
                              ) {
                                IconName = FreezerIcon;
                              } else if (route.name === t('settings')) {
                                IconName = SettingsIcon;
                              }

                              return (
                                <View style={styles.tabIcon}>
                                  <IconName
                                    width={size}
                                    height={size}
                                    fill={color}
                                  />
                                  {route.name === t('freezer') && (
                                    <IconName
                                      width={size}
                                      height={size}
                                      fill={color}
                                    />
                                  )}
                                </View>
                              );
                            },
                          })}
                          tabBarOptions={{
                            ...tabBarOptions,
                            activeTintColor: primary,
                          }}
                        >
                          <Tab.Screen
                            name={t('fridge')}
                            component={FridgeStackScreen}
                            options={{
                              tabBarBadge: countExpiredItems(productsList),
                            }}
                          />
                          <Tab.Screen
                            name={t('freezer')}
                            component={FreezerStackScreen}
                          />
                          <Tab.Screen
                            name={t('settings')}
                            component={SettingsStackScreen}
                          />
                        </Tab.Navigator>
                      ) : (
                        <SingInStackScreen />
                      )}
                    </NavigationContainer>
                  )}
                </ProductsProvider>
              )}
            </ThemeProvider>
          )}
        </LocaleProvider>
      )}
    </AuthProvider>
  );
}

registerRootComponent(App);

const styles = StyleSheet.create({
  tabIcon: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

const tabBarOptions = {
  inactiveTintColor: 'black',
  showIcon: true,
  showLabel: true,
  upperCaseLabel: true,
  labelStyle: {
    fontFamily: 'OpenSans-Regular',
    textTransform: 'uppercase',
  },
};
