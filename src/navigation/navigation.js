import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProductList from '../components/ProductList';
import ProductForm from '../components/ProductForm';

const Stack = createStackNavigator();

export function FridgeStackScreen() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="list"
          component={ProductList}
          options={{ title: 'My fridge' }}
          initialParams={{ place: 'fridge' }}
        />
        <Stack.Screen
          name="form"
          component={ProductForm}
          options={{ title: 'Add item' }}
        />
      </Stack.Navigator>
    );
}

export function FreezerStackScreen() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="list"
          component={ProductList}
          options={{ title: 'My freezer' }}
          initialParams={{ place: 'freezer' }}
        />
        <Stack.Screen
          name="form"
          component={ProductForm}
          options={{ title: 'Add item' }}
        />
      </Stack.Navigator>
    );
}
