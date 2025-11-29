import "react-native-gesture-handler";
import Loading from "@components/Loading/Loading";
import { OfflineIndicator } from "@components/OfflineIndicator/OfflineIndicator";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { memo, useContext } from "react";

import NotificationOnboardingModal from "./components/NotificationOnboardingModal/NotificationOnboardingModal";
import { COLORS } from "./constants/colors";
import TabNavigator from "./navigation/TabNavigator";
import { SignInStackScreen } from "./navigation/navigation";
import {
  authStore,
  AuthProvider,
  LocaleProvider,
  NetworkProvider,
  NotificationProvider,
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
        backgroundColor={userToken ? theme.primary : COLORS.WHITE}
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
    <NetworkProvider>
      <AuthProvider>
        <LocaleProvider>
          <ThemeProvider>
            <ProductsProvider>
              <NotificationProvider>
                <RootNavigator />
                <NotificationOnboardingModal />
              </NotificationProvider>
            </ProductsProvider>
          </ThemeProvider>
        </LocaleProvider>
      </AuthProvider>
    </NetworkProvider>
  );
};

export default memo(AppContainer);
