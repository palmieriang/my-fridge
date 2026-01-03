import { Text, View } from "react-native";

import styles from "./styles";
import { useLocale, useTheme } from "../../store";
import { useNetwork } from "../../store/networkContext";

export const OfflineIndicator = () => {
  const { isConnected, isInternetReachable } = useNetwork();
  const { t } = useLocale();
  const { theme } = useTheme();

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
