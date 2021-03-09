import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { adjust } from '@components/utils/dimensions';
import { localeStore } from '../store/localeStore';
import { themeStore } from '../store/themeStore';
import ProductList from '@screens/ProductList/ProductList';
import ProductForm from '@screens/ProductForm/ProductForm';
import Settings from '@screens/Settings/Settings';
import SignIn from '@screens/SignIn/SignIn';
import Registration from '@screens/Registration/Registration';

const Stack = createStackNavigator();

const screenOptions = {
  headerStyle: {
    elevation: 0,
    shadowColor: 'transparent',
    shadowRadius: 0,
    shadowOffset: {
      height: 0,
    },
  },
  headerTitleAlign: 'center',
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontFamily: 'Nunito-Bold',
    fontSize: adjust(18),
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
