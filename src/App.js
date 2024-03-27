import "react-native-gesture-handler";
import Icon from "@components/Icon/Icon";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { registerRootComponent } from "expo";
import { useFonts } from "expo-font";
import React from "react";
import { LogBox } from "react-native";

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
import { customFonts } from "./typography/typography";
import { countExpiredItems } from "../src/utils";

LogBox.ignoreLogs([
  "Warning: componentWillMount is deprecated",
  "Warning: componentWillReceiveProps has been renamed",
  "Warning: Setting a timer",
]);

const Tab = createBottomTabNavigator();

export default function App() {
  const [fontsLoaded] = useFonts(customFonts);

  if (!fontsLoaded) {
    return null;
  }

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

registerRootComponent(App);

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
