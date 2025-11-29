import { useContext, useEffect, useRef } from "react";
import { Text, Animated } from "react-native";

import styles from "./styles";
import { localeStore, themeStore } from "../../store";
import { useNetwork } from "../../store/networkContext";

export const OfflineIndicator = () => {
  const { isConnected, isInternetReachable } = useNetwork();
  const {
    localizationContext: { t },
  } = useContext(localeStore);
  const { theme } = useContext(themeStore);
  const heightAnim = useRef(new Animated.Value(0)).current;
  const isVisible = useRef(false);

  const isOffline = !isConnected || isInternetReachable === false;

  useEffect(() => {
    if (isOffline) {
      isVisible.current = true;
      Animated.timing(heightAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(heightAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        isVisible.current = false;
      });
    }
  }, [isOffline, heightAnim]);

  if (!isOffline && !isVisible.current) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: theme.primary,
          opacity: heightAnim,
          maxHeight: heightAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 30],
          }),
        },
      ]}
    >
      <Text style={styles.icon}>📡</Text>
      <Text style={styles.text}>{t("offlineMessage")}</Text>
    </Animated.View>
  );
};
