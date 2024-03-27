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

function AppContainer() {
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
                        TabNavigator(productsList, t, primary)
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

export default memo(AppContainer);
