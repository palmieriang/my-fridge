import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View, YellowBox } from 'react-native';
import {
  FridgeStackScreen,
  FreezerStackScreen,
  SettingsStackScreen,
  SingInStackScreen
} from './navigation/navigation';
import FreezerIcon from '../assets/freezer.svg';
import SettingsIcon from '../assets/settings.svg';

import { decode, encode } from 'base-64'
global.crypto = require("@firebase/firestore");
global.crypto.getRandomValues = byteArray => { for (let i = 0; i < byteArray.length; i++) { byteArray[i] = Math.floor(256 * Math.random()); } }

if (!global.btoa) { global.btoa = encode; }
if (!global.atob) { global.atob = decode; }

import { AuthProvider } from './store/authStore';
import { LocaleProvider } from './store/localeStore';

YellowBox.ignoreWarnings([
  'Warning: componentWillMount is deprecated',
  'Warning: componentWillReceiveProps has been renamed',
]);

const Tab = createBottomTabNavigator();

export default function App() {

  return (
    <AuthProvider>
      {({authState: { userToken }}) => (
        <LocaleProvider>
          {({localizationContext: { t }}) => (
            <NavigationContainer>
              {userToken ? (
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
                    activeTintColor: '#e74c3c',
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
  }
});
