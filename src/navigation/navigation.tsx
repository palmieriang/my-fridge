import {
  createStackNavigator,
  StackNavigationOptions,
} from "@react-navigation/stack";
import ProductForm from "@screens/ProductForm/ProductForm";
import ProductList from "@screens/ProductList/ProductList";
import Registration from "@screens/Registration/Registration";
import Settings from "@screens/Settings/Settings";
import ShoppingList from "@screens/ShoppingList/ShoppingList";
import SignIn from "@screens/SignIn/SignIn";
import { COLORS } from "src/constants/colors";

import { RootStackParamList } from "./navigation.d";
import { FRIDGE, FREEZER, SETTINGS, SHOPPING_LIST } from "../constants";
import { useLocale, useTheme } from "../store";
import { Typography } from "../typography/responsive";

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
  headerTintColor: COLORS.WHITE,
  headerTitleStyle: {
    fontFamily: "Nunito-Bold",
    fontSize: Typography.subtitle,
    textTransform: "uppercase",
  },
};

export function FridgeStackScreen() {
  const { t } = useLocale();
  const {
    theme: { primary },
  } = useTheme();

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
  const { t } = useLocale();
  const {
    theme: { primary },
  } = useTheme();

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
  const { t } = useLocale();
  const {
    theme: { primary },
  } = useTheme();

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
        name="settingsScreen"
        component={Settings}
        options={{ title: t(SETTINGS) }}
      />
    </Stack.Navigator>
  );
}

export function ShoppingListStackScreen() {
  const { t } = useLocale();
  const {
    theme: { primary },
  } = useTheme();

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
        name="shoppingListScreen"
        component={ShoppingList}
        options={{ title: t(SHOPPING_LIST) }}
      />
    </Stack.Navigator>
  );
}

export function SignInStackScreen() {
  const { t } = useLocale();
  return (
    <Stack.Navigator
      screenOptions={{
        ...screenOptions,
        headerTintColor: COLORS.PRIMARY_BLUE,
      }}
    >
      <Stack.Screen
        name="signin"
        component={SignIn}
        options={{ title: t("signIn") }}
      />
      <Stack.Screen
        name="registration"
        component={Registration}
        options={{ title: t("createAccount") }}
      />
    </Stack.Navigator>
  );
}
