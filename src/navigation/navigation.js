import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { LocalizationContext } from '../localization/localization';
import ProductList from '../components/ProductList';
import ProductForm from '../components/ProductForm';
import Settings from '../components/Settings';
import SignIn from '../components/SignIn';

const Stack = createStackNavigator();

export function FridgeStackScreen() {
  const { t } = useContext(LocalizationContext);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="list"
        component={ProductList}
        options={{ title: t('title') }}
        initialParams={{ place: 'fridge' }}
      />
      <Stack.Screen
        name="form"
        component={ProductForm}
        options={({ route }) => ({
          title: route.params.title
        })}
      />
    </Stack.Navigator>
  );
}

export function FreezerStackScreen() {
  const { t } = useContext(LocalizationContext);

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
        options={{ title: t('add') }}
      />
    </Stack.Navigator>
  );
}

export function SettingsStackScreen() {
  const { t } = useContext(LocalizationContext);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="settings"
        component={Settings}
        options={{ title: t('settings') }}
      />
    </Stack.Navigator>
  );
}

export function SingInStackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="signin"
        component={SignIn}
        options={{ title: 'Login' }}
      />
    </Stack.Navigator>
  );
}
