import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import React, { memo } from "react";

import TabNavigator from "./TabNavigator";
import { SingInStackScreen } from "./navigation/navigation";
import {
  AuthProvider,
  LocaleProvider,
  ProductsProvider,
  ThemeProvider,
} from "./store";

const AppContainer = () => {
  return (
    <AuthProvider>
      {({ authState: { userToken } }) => (
        <LocaleProvider>
          <ThemeProvider>
            <ProductsProvider>
              <NavigationContainer>
                {userToken ? <TabNavigator /> : <SingInStackScreen />}
              </NavigationContainer>
            </ProductsProvider>
          </ThemeProvider>
        </LocaleProvider>
      )}
    </AuthProvider>
  );
};

export default memo(AppContainer);
