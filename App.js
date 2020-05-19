import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { YellowBox } from 'react-native';

import { FridgeStackScreen, FreezerStackScreen } from './src/navigation/navigation';

YellowBox.ignoreWarnings([
  'Warning: componentWillMount is deprecated',
  'Warning: componentWillReceiveProps has been renamed',
]);

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Fridge" component={FridgeStackScreen} />
        <Tab.Screen name="Freezer" component={FreezerStackScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
