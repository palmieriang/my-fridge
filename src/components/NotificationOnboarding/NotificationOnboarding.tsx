import { useContext, FC, useState } from "react";
import { View, Text, Alert, TouchableOpacity } from "react-native";

import styles from "./styles";
import { requestNotificationPermission } from "../../../api/api";
import { authStore, localeStore, themeStore } from "../../store";
import Button from "../Button/Button";

interface NotificationOnboardingProps {
  onComplete: () => void;
  onSkip?: () => void;
}

const NotificationOnboarding: FC<NotificationOnboardingProps> = ({
  onComplete,
  onSkip,
}) => {
  const { authState } = useContext(authStore);
  const {
    localizationContext: { t },
  } = useContext(localeStore);
  const { theme } = useContext(themeStore);
  const userId = authState.user?.uid;
  const [isLoading, setIsLoading] = useState(false);

  const handleEnableNotifications = async () => {
    if (!userId) {
      Alert.alert(t("notificationsError"), t("notificationsUserNotFound"));
      return;
    }

    setIsLoading(true);
    try {
      const result = await requestNotificationPermission(userId);

      if (result.success) {
        Alert.alert(
          t("notificationsOnboardingSuccess"),
          t("notificationsOnboardingSuccessMessage"),
          [{ text: t("notificationsContinue"), onPress: onComplete }],
        );
      } else {
        Alert.alert(
          t("notificationsPermissionNeeded"),
          t("notificationsPermissionRequiredMessage"),
          [
            { text: t("cancel"), style: "cancel" },
            {
              text: t("notificationsOpenSettings"),
              onPress: () => {
                // Open device settings. This would need platform-specific implementation
              },
            },
          ],
        );
      }
    } catch (error) {
      console.error("Error enabling notifications:", error);
      Alert.alert(
        t("notificationsError"),
        t("notificationsSomethingWentWrong"),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    } else {
      onComplete();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <Text style={styles.emoji}>🔔</Text>
        <Text style={[styles.title, { color: theme.text }]}>
          {t("notificationsOnboardingTitle")}
        </Text>
        <Text style={[styles.description, { color: theme.text }]}>
          {t("notificationsOnboardingDescription")}
        </Text>

        <View style={styles.benefitsContainer}>
          <Text style={[styles.benefit, { color: theme.text }]}>
            {t("notificationsOnboardingBenefit1")}
          </Text>
          <Text style={[styles.benefit, { color: theme.text }]}>
            {t("notificationsOnboardingBenefit2")}
          </Text>
          <Text style={[styles.benefit, { color: theme.text }]}>
            {t("notificationsOnboardingBenefit3")}
          </Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          text={t("notificationsEnableButton")}
          onPress={handleEnableNotifications}
          disabled={isLoading}
        />
        <TouchableOpacity
          onPress={handleSkip}
          style={styles.skipButton}
          accessibilityRole="button"
          accessibilityLabel={t("notificationsSkipButton")}
          disabled={isLoading}
        >
          <Text style={[styles.skipButton, { color: theme.text }]}>
            {t("notificationsSkipButton")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NotificationOnboarding;
