import "react-native-gesture-handler";
import Loading from "@components/Loading/Loading";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { memo } from "react";

import NotificationOnboardingModal from "./components/NotificationOnboardingModal/NotificationOnboardingModal";
import { COLORS } from "./constants/colors";
import TabNavigator from "./navigation/TabNavigator";
import { SignInStackScreen } from "./navigation/navigation";
import {
  AuthProvider,
  LocaleProvider,
  NetworkProvider,
  NotificationProvider,
  ProductsProvider,
  ThemeProvider,
  useAuth,
  useTheme,
} from "./store";

const RootNavigator = () => {
  const { authState } = useAuth();
  const { theme } = useTheme();
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
