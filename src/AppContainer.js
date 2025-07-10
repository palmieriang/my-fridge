import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import React, { memo, useContext } from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";

import TabNavigator from "./navigation/TabNavigator";
import { SignInStackScreen } from "./navigation/navigation";
import {
  authStore,
  AuthProvider,
  LocaleProvider,
  ProductsProvider,
  ThemeProvider,
} from "./store";

const RootNavigator = () => {
  const { authState } = useContext(authStore);
  const { userToken, isLoading } = authState;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {userToken ? <TabNavigator /> : <SignInStackScreen />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

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
