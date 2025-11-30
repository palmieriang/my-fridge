import { useContext } from "react";
import { Text, View } from "react-native";

import styles from "./styles";
import { localeStore, themeStore } from "../../store";
import { useNetwork } from "../../store/networkContext";

export const OfflineIndicator = () => {
  const { isConnected, isInternetReachable } = useNetwork();
  const {
    localizationContext: { t },
  } = useContext(localeStore);
  const { theme } = useContext(themeStore);

  const isOffline = !isConnected || isInternetReachable === false;

  if (!isOffline) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.primary }]}>
      <Text style={styles.icon}>📡</Text>
      <Text style={styles.text}>{t("offlineMessage")}</Text>
    </View>
  );
};
