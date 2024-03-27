import "react-native-gesture-handler";
import Icon from "@components/Icon/Icon";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";

import { FRIDGE, FREEZER, SETTINGS } from "./constants";
import {
  FridgeStackScreen,
  FreezerStackScreen,
  SettingsStackScreen,
  SingInStackScreen,
} from "./navigation/navigation";
import {
  AuthProvider,
  LocaleProvider,
  ProductsProvider,
  ThemeProvider,
} from "./store";
import { countExpiredItems } from "../src/utils";

const Tab = createBottomTabNavigator();

export default function AppContainer() {
  return (
    <AuthProvider>
      {({ authState: { userToken } }) => (
        <LocaleProvider>
          {({ localizationContext: { t } }) => (
            <ThemeProvider>
              {({ theme: { primary } }) => (
                <ProductsProvider>
                  {({ productsList }) => (
                    <NavigationContainer>
                      {userToken ? (
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
                          <Tab.Screen
                            name={t(FREEZER)}
                            component={FreezerStackScreen}
                          />
                          <Tab.Screen
                            name={t(SETTINGS)}
                            component={SettingsStackScreen}
                          />
                        </Tab.Navigator>
                      ) : (
                        <SingInStackScreen />
                      )}
                    </NavigationContainer>
                  )}
                </ProductsProvider>
              )}
            </ThemeProvider>
          )}
        </LocaleProvider>
      )}
    </AuthProvider>
  );
}

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
