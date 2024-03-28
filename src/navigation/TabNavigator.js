import Icon from "@components/Icon/Icon";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useContext } from "react";

import {
  FridgeStackScreen,
  FreezerStackScreen,
  SettingsStackScreen,
} from "./navigation";
import { FRIDGE, FREEZER, SETTINGS } from "../constants";
import { localeStore, productsStore, themeStore } from "../store";
import { countExpiredItems } from "../utils";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const {
    localizationContext: { t },
  } = useContext(localeStore);
  const {
    theme: { primary },
  } = useContext(themeStore);
  const { productsList } = useContext(productsStore);

  const routeTypeMapping = {
    [t(FRIDGE)]: FRIDGE,
    [t(FREEZER)]: FREEZER,
    [t(SETTINGS)]: SETTINGS,
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => (
          <Icon
            type={routeTypeMapping[route.name]}
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
};

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
