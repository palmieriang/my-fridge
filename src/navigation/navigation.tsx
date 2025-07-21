import { adjust } from "@components/utils/dimensions";
import {
  createStackNavigator,
  StackNavigationOptions,
} from "@react-navigation/stack";
import ProductForm from "@screens/ProductForm/ProductForm";
import ProductList from "@screens/ProductList/ProductList";
import Registration from "@screens/Registration/Registration";
import Settings from "@screens/Settings/Settings";
import SignIn from "@screens/SignIn/SignIn";
import { useContext } from "react";

import { RootStackParamList } from "./navigation.d";
import { FRIDGE, FREEZER, SETTINGS } from "../constants";
import { localeStore, themeStore } from "../store";

const Stack = createStackNavigator<RootStackParamList>();

const screenOptions: StackNavigationOptions = {
  headerStyle: {
    elevation: 0,
    shadowColor: "transparent",
    shadowRadius: 0,
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },
  headerTitleAlign: "center",
  headerTintColor: "#fff",
  headerTitleStyle: {
    fontFamily: "Nunito-Bold",
    fontSize: adjust(18),
    textTransform: "uppercase",
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
        headerStyle: {
          ...(screenOptions.headerStyle as object),
          backgroundColor: primary,
        },
      }}
    >
      <Stack.Screen
        name="list"
        component={ProductList}
        options={{ title: t("title") }}
        initialParams={{ place: FRIDGE }}
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
        headerStyle: {
          ...(screenOptions.headerStyle as object),
          backgroundColor: primary,
        },
      }}
    >
      <Stack.Screen
        name="list"
        component={ProductList}
        options={{ title: "Freezer" }}
        initialParams={{ place: FREEZER }}
      />
      <Stack.Screen
        name="form"
        component={ProductForm}
        options={{ title: t("add") }}
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
        headerStyle: {
          ...(screenOptions.headerStyle as object),
          backgroundColor: primary,
        },
      }}
    >
      <Stack.Screen
        name="settings"
        component={Settings}
        options={{ title: t(SETTINGS) }}
      />
    </Stack.Navigator>
  );
}

export function SignInStackScreen() {
  return (
    <Stack.Navigator
      screenOptions={{
        ...screenOptions,
        headerTintColor: "#48bbec",
      }}
    >
      <Stack.Screen
        name="signin"
        component={SignIn}
        options={{ title: "Login" }}
      />
      <Stack.Screen
        name="registration"
        component={Registration}
        options={{ title: "Create account" }}
      />
    </Stack.Navigator>
  );
}
