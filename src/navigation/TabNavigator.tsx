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

const TabNavigator = () => {
  const { t } = useLocale();
  const {
    theme: { primary },
  } = useTheme();
  const { productsList } = useProducts();

  const expiredCount = countExpiredItems(productsList);

  const routeTypeMapping: Record<
    string,
    "fridge" | "freezer" | "settings" | "shoppingList"
  > = {
    [t(FRIDGE)]: FRIDGE,
    [t(FREEZER)]: FREEZER,
    [t(SHOPPING_LIST_TAB)]: SHOPPING_LIST,
    [t(SETTINGS)]: SETTINGS,
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }): BottomTabNavigationOptions => ({
        tabBarIcon: ({ focused, color, size }) => (
          <Icon
            type={routeTypeMapping[route.name]}
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
        name={t(FRIDGE)}
        component={FridgeStackScreen}
        options={{
          tabBarBadge: expiredCount || undefined,
          tabBarAccessibilityLabel: expiredCount
            ? `${t("fridge")}, ${expiredCount} ${t("expiredItems")}`
            : t("fridge"),
        }}
      />
      <Tab.Screen name={t(FREEZER)} component={FreezerStackScreen} />
      <Tab.Screen
        name={t(SHOPPING_LIST_TAB)}
        component={ShoppingListStackScreen}
      />
      <Tab.Screen name={t(SETTINGS)} component={SettingsStackScreen} />
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
