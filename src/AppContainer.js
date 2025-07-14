import "react-native-gesture-handler";
import Loading from "@components/Loading/Loading";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React, { memo, useContext } from "react";

import TabNavigator from "./navigation/TabNavigator";
import { SignInStackScreen } from "./navigation/navigation";
import {
  authStore,
  AuthProvider,
  LocaleProvider,
  ProductsProvider,
  ThemeProvider,
  themeStore,
} from "./store";

const RootNavigator = () => {
  const { authState } = useContext(authStore);
  const { theme } = useContext(themeStore);
  const { userToken, isLoading } = authState;

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <StatusBar
        style="auto"
        backgroundColor={userToken ? theme.primary : "#ffffff"}
        translucent={false}
      />
      <NavigationContainer>
        {userToken ? <TabNavigator /> : <SignInStackScreen />}
      </NavigationContainer>
    </>
  );
};

const AppContainer = () => {
  return (
    <AuthProvider>
      <LocaleProvider>
        <ThemeProvider>
          <ProductsProvider>
            <RootNavigator />
          </ProductsProvider>
        </ThemeProvider>
      </LocaleProvider>
    </AuthProvider>
  );
};

export default memo(AppContainer);
