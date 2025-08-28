import { useEffect, useContext } from "react";
import { View, Text, Switch } from "react-native";

import styles from "./styles";
import { COLORS } from "../../constants/colors";
import {
  authStore,
  localeStore,
  notificationStore,
  themeStore,
} from "../../store";

const NotificationSettings = () => {
  const { authState } = useContext(authStore);
  const {
    localizationContext: { t },
  } = useContext(localeStore);
  const { theme } = useContext(themeStore);
  const { notificationState, notificationContext } =
    useContext(notificationStore);
  const userId = authState.user?.uid;

  const { notificationsEnabled, loading } = notificationState;
  const { loadNotificationSettings, toggleNotifications } = notificationContext;

  useEffect(() => {
    if (userId) {
      loadNotificationSettings(userId);
    }
  }, [userId, loadNotificationSettings]);

  const handleToggle = (value: boolean) => {
    if (userId) {
      toggleNotifications(userId, t);
    }
  };

  return (
    <View style={styles.settingRow}>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, { color: theme.text }]}>
          🔔 {t("notificationsPushNotifications")}
        </Text>
        <Text style={[styles.settingDescription, { color: theme.text }]}>
          {t("notificationsPushNotificationsDescription")}
        </Text>
      </View>
      <View style={styles.switchContainer}>
        <Switch
          value={notificationsEnabled}
          onValueChange={handleToggle}
          disabled={loading}
          trackColor={{
            false: theme.text,
            true: theme.primary,
          }}
          thumbColor={COLORS.WHITE}
          ios_backgroundColor={theme.text}
        />
      </View>
    </View>
  );
};

export default NotificationSettings;
