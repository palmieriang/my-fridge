import Icon from "@components/Icon/Icon";
import {
  createBottomTabNavigator,
  BottomTabNavigationOptions,
} from "@react-navigation/bottom-tabs";

import {
  FridgeStackScreen,
  FreezerStackScreen,
  SettingsStackScreen,
  ShoppingListStackScreen,
} from "./navigation";
import { FRIDGE, FREEZER, SETTINGS, SHOPPING_LIST } from "../constants";
import { useLocale, useProducts, useTheme } from "../store";
import { countExpiredItems } from "../utils";

const Tab = createBottomTabNavigator();
const SHOPPING_LIST_TAB = "shoppingListTab";

const routeIconTypeMapping: Record<
  string,
  "fridge" | "freezer" | "settings" | "shoppingList"
> = {
  [FRIDGE]: FRIDGE,
  [FREEZER]: FREEZER,
  [SHOPPING_LIST]: SHOPPING_LIST,
  [SETTINGS]: SETTINGS,
};

const TabNavigator = () => {
  const { t } = useLocale();
  const {
    theme: { primary },
  } = useTheme();
  const { productsList } = useProducts();

  const expiredCount = countExpiredItems(productsList);

  return (
    <Tab.Navigator
      screenOptions={({ route }): BottomTabNavigationOptions => ({
        tabBarIcon: ({ focused, color, size }) => (
          <Icon
            type={routeIconTypeMapping[route.name]}
            size={size}
            fill={color}
            focused={focused}
          />
        ),
        ...tabBarOptions,
        tabBarActiveTintColor: primary,
      })}
    >
      <Tab.Screen
        name={FRIDGE}
        component={FridgeStackScreen}
        options={{
          tabBarLabel: t(FRIDGE),
          tabBarBadge: expiredCount || undefined,
          tabBarAccessibilityLabel: expiredCount
            ? `${t("fridge")}, ${expiredCount} ${t("expiredItems")}`
            : t("fridge"),
        }}
      />
      <Tab.Screen
        name={FREEZER}
        component={FreezerStackScreen}
        options={{ tabBarLabel: t(FREEZER) }}
      />
      <Tab.Screen
        name={SHOPPING_LIST}
        component={ShoppingListStackScreen}
        options={{ tabBarLabel: t(SHOPPING_LIST_TAB) }}
      />
      <Tab.Screen
        name={SETTINGS}
        component={SettingsStackScreen}
        options={{ tabBarLabel: t(SETTINGS) }}
      />
    </Tab.Navigator>
  );
};

const tabBarOptions: BottomTabNavigationOptions = {
  headerShown: false,
  tabBarInactiveTintColor: "black",
  tabBarShowLabel: true,
  tabBarLabelStyle: {
    fontFamily: "OpenSans-Regular",
    textTransform: "uppercase",
  },
};

export default TabNavigator;
