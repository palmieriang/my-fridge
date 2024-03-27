import Icon from "@components/Icon/Icon";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { FRIDGE, FREEZER, SETTINGS } from "./constants";
import {
  FridgeStackScreen,
  FreezerStackScreen,
  SettingsStackScreen,
} from "./navigation/navigation";
import { countExpiredItems } from "../src/utils";

const Tab = createBottomTabNavigator();

const TabNavigator = (productsList, t, primary) => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => (
        <Icon
          type={route.name.toLowerCase()}
          size={size}
          fill={color}
          focused={focused}
        />
      ),
    })}
    tabBarOptions={{
      ...tabBarOptions,
      activeTintColor: primary,
    }}
  >
    <Tab.Screen
      name={t(FRIDGE)}
      component={FridgeStackScreen}
      options={{
        tabBarBadge: countExpiredItems(productsList),
      }}
    />
    <Tab.Screen name={t(FREEZER)} component={FreezerStackScreen} />
    <Tab.Screen name={t(SETTINGS)} component={SettingsStackScreen} />
  </Tab.Navigator>
);

const tabBarOptions = {
  inactiveTintColor: "black",
  showIcon: true,
  showLabel: true,
  upperCaseLabel: true,
  labelStyle: {
    fontFamily: "OpenSans-Regular",
    textTransform: "uppercase",
  },
};

export default TabNavigator;
