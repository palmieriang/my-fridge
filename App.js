import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { YellowBox } from 'react-native';

import ProductList from "./components/ProductList";
import ProductForm from "./components/ProductForm";

YellowBox.ignoreWarnings([
  'Warning: componentWillMount is deprecated',
  'Warning: componentWillReceiveProps has been renamed',
]);

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="list"
          component={ProductList}
          options={{ title: 'My fridge' }}
        />
        <Stack.Screen
          name="form"
          component={ProductForm}
          options={{ title: 'Add item' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
