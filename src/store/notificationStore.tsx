import { useState, ReactNode } from "react";
import { Alert } from "react-native";

import { NotificationStoreContext } from "./contexts";
import type {
  NotificationStateType,
  NotificationContextMethods,
  NotificationStoreValue,
} from "./types";
import {
  getUserNotificationSettings,
  requestNotificationPermission,
  disableNotifications,
} from "../../api/api";

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider = ({
  children,
}: NotificationProviderProps) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadNotificationSettings = async (userId: string) => {
    setLoading(true);
    try {
      const settings = await getUserNotificationSettings(userId);
      setNotificationsEnabled(settings.notificationsEnabled);
    } catch (error) {
      console.error("Error loading notification settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateNotificationsEnabled = (enabled: boolean) => {
    setNotificationsEnabled(enabled);
  };

  const toggleNotifications = async (
    userId: string,
    t: (key: string) => string,
  ) => {
    if (!userId) {
      Alert.alert(t("notificationsError"), t("notificationsUserNotFound"));
      return;
    }

    setLoading(true);

    try {
      if (!notificationsEnabled) {
        const result = await requestNotificationPermission(userId);

        if (result.success) {
          setNotificationsEnabled(true);
          Alert.alert(
            t("notificationsEnabled"),
            t("notificationsEnabledMessage"),
          );
        } else {
          Alert.alert(
            t("notificationsPermissionRequired"),
            t("notificationsPermissionRequiredMessage"),
            [
              { text: t("cancel"), style: "cancel" },
              {
                text: t("notificationsOpenSettings"),
                onPress: () => {
                  // You can add logic to open device settings here
                },
              },
            ],
          );
        }
      } else {
        const result = await disableNotifications(userId);

        if (result.success) {
          setNotificationsEnabled(false);
          Alert.alert(
            t("notificationsDisabled"),
            t("notificationsDisabledMessage"),
          );
        } else {
          Alert.alert(
            t("notificationsError"),
            t("notificationsSomethingWentWrong"),
          );
        }
      }
    } catch (error) {
      console.error("Error toggling notifications:", error);
      Alert.alert(
        t("notificationsError"),
        t("notificationsSomethingWentWrong"),
      );
    } finally {
      setLoading(false);
    }
  };

  const showPermissionDialog = (
    onAccept: () => void,
    onDecline: () => void,
  ): void => {
    Alert.alert(
      "🔔 Enable Notifications",
      "Get notified when your food is about to expire so you never waste anything!",
      [
        {
          text: "Not Now",
          style: "cancel",
          onPress: onDecline,
        },
        {
          text: "Enable",
          onPress: onAccept,
        },
      ],
    );
  };

  const notificationState: NotificationStateType = {
    notificationsEnabled,
    loading,
  };

  const notificationContext: NotificationContextMethods = {
    loadNotificationSettings,
    setNotificationsEnabled: updateNotificationsEnabled,
    toggleNotifications,
    showNotificationPermissionDialog: showPermissionDialog,
  };

  const storeValue: NotificationStoreValue = {
    notificationState,
    notificationContext,
  };

  return (
    <NotificationStoreContext.Provider value={storeValue}>
      {children}
    </NotificationStoreContext.Provider>
  );
};

export const notificationStore = NotificationStoreContext;
