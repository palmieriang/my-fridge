import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { localeStore } from '../store/localeStore';
import { themeStore } from '../store/themeStore';
import ProductList from '../components/ProductList';
import ProductForm from '../components/ProductForm';
import Settings from '../components/Settings';
import SignIn from '../components/SignIn';
import Registration from '../components/Registration';

const Stack = createStackNavigator();

const screenOptions = {
  headerStyle: {
    shadowColor: 'transparent',
    shadowRadius: 0,
    shadowOffset: {
      height: 0,
    },
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontFamily: 'NunitoRegular',
    fontSize: 20,
    alignSelf: 'center',
    textTransform: 'uppercase',
  },
};

export function FridgeStackScreen() {
  const {
    localizationContext: { t },
  } = useContext(localeStore);
  const {
    theme: { primary },
  } = useContext(themeStore);

  return (
    <Stack.Navigator
      screenOptions={{
        ...screenOptions,
        headerStyle: { ...screenOptions.headerStyle, backgroundColor: primary },
      }}
    >
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
          title: route.params.title,
        })}
      />
    </Stack.Navigator>
  );
}

export function FreezerStackScreen() {
  const {
    localizationContext: { t },
  } = useContext(localeStore);
  const {
    theme: { primary },
  } = useContext(themeStore);

  return (
    <Stack.Navigator
      screenOptions={{
        ...screenOptions,
        headerStyle: { ...screenOptions.headerStyle, backgroundColor: primary },
      }}
    >
      <Stack.Screen
        name="list"
        component={ProductList}
        options={{ title: 'Freezer' }}
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
  const {
    localizationContext: { t },
  } = useContext(localeStore);
  const {
    theme: { primary },
  } = useContext(themeStore);

  return (
    <Stack.Navigator
      screenOptions={{
        ...screenOptions,
        headerStyle: { ...screenOptions.headerStyle, backgroundColor: primary },
      }}
    >
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
    <Stack.Navigator
      screenOptions={{
        ...screenOptions,
        headerTintColor: '#48bbec',
      }}
    >
      <Stack.Screen
        name="signin"
        component={SignIn}
        options={{ title: 'Login' }}
      />
      <Stack.Screen
        name="registration"
        component={Registration}
        options={{ title: 'Create account' }}
      />
    </Stack.Navigator>
  );
}
