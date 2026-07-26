import "react-native-gesture-handler";
import Loading from "@components/Loading/Loading";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { memo, useEffect, useRef, useState } from "react";
import { Animated } from "react-native";

import FridgeDoorTransition from "./animations/FridgeDoorTransition";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import NotificationOnboardingModal from "./components/NotificationOnboardingModal/NotificationOnboardingModal";
import { COLORS } from "./constants/colors";
import TabNavigator from "./navigation/TabNavigator";
import { SignInStackScreen } from "./navigation/navigation";
import {
  AppTutorialProvider,
  AuthProvider,
  LocaleProvider,
  NetworkProvider,
  NotificationProvider,
  ProductsProvider,
  ShoppingListProvider,
  ThemeProvider,
  useAuth,
  useTheme,
} from "./store";

const FADE_DURATION = 200;

const RootNavigator = () => {
  const { authState } = useAuth();
  const { theme } = useTheme();
  const { userToken, isLoading } = authState;

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [visibleToken, setVisibleToken] = useState(userToken);
  const [showDoor, setShowDoor] = useState(false);
  const isFirstRender = useRef(true);
  const prevToken = useRef(userToken);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      prevToken.current = userToken;
      setVisibleToken(userToken);
      return;
    }

    const wasLoggedOut = prevToken.current == null;
    const isNowLoggedIn = userToken != null;
    prevToken.current = userToken;

    if (wasLoggedOut && isNowLoggedIn) {
      // Login: switch the navigator immediately, then open the fridge door on top
      setVisibleToken(userToken);
      setShowDoor(true);
    } else {
      // Logout or token refresh: simple fade
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: FADE_DURATION,
        useNativeDriver: true,
      }).start(() => {
        setVisibleToken(userToken);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: FADE_DURATION,
          useNativeDriver: true,
        }).start();
      });
    }
  }, [userToken]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      <StatusBar
        style="auto"
        backgroundColor={visibleToken ? theme.primary : COLORS.WHITE}
        translucent={false}
      />
      <NavigationContainer>
        {visibleToken ? <TabNavigator /> : <SignInStackScreen />}
      </NavigationContainer>
      {showDoor && <FridgeDoorTransition onDone={() => setShowDoor(false)} />}
    </Animated.View>
  );
};

const AppContainer = () => {
  return (
    <ErrorBoundary>
      <NetworkProvider>
        <AuthProvider>
          <LocaleProvider>
            <ThemeProvider>
              <ProductsProvider>
                <ShoppingListProvider>
                  <NotificationProvider>
                    <AppTutorialProvider>
                      <RootNavigator />
                      <NotificationOnboardingModal />
                    </AppTutorialProvider>
                  </NotificationProvider>
                </ShoppingListProvider>
              </ProductsProvider>
            </ThemeProvider>
          </LocaleProvider>
        </AuthProvider>
      </NetworkProvider>
    </ErrorBoundary>
  );
};

export default memo(AppContainer);
