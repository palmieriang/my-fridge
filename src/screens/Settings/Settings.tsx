import NotificationSettings from "@components/NotificationSettings/NotificationSettings";
import { LanguagePicker } from "@components/Picker/LanguagePicker";
import { ThemePicker } from "@components/Picker/ThemePicker";
import { UserActions } from "@components/UserActions/UserActions";
import BrushIcon from "@components/svg/BrushIcon";
import LanguageIcon from "@components/svg/LanguageIcon";
import { getMessaging, getToken } from "@react-native-firebase/messaging";
import { useContext, useEffect, useState } from "react";
import { View, TouchableOpacity, Text, Alert, ScrollView } from "react-native";

import styles from "./styles";
import { getUserNotificationSettings } from "../../../api/api";
import { authStore, localeStore, themeStore } from "../../store";
import type { SupportedLocale } from "../../store/types";
import Profile from "../Profile/Profile";

const Settings = () => {
  const {
    localizationContext: { changeLocale, locale },
  } = useContext(localeStore);
  const {
    userData: { id },
  } = useContext(authStore);
  const {
    theme,
    themeName,
    themeContext: { changeTheme },
  } = useContext(themeStore);

  const [selectedLocale, setSelectedLocale] = useState<SupportedLocale>(locale);
  const [selectedTheme, setSelectedTheme] = useState<string>(themeName);

  useEffect(() => {
    setSelectedLocale(locale);
  }, [locale]);

  useEffect(() => {
    setSelectedTheme(themeName);
  }, [themeName]);

  const handleLocaleChange = (newLocale: SupportedLocale) => {
    if (!newLocale) return;
    setSelectedLocale(newLocale);
    changeLocale({ newLocale, id });
  };

  const handleThemeChange = (newTheme: string) => {
    if (!newTheme) return;
    setSelectedTheme(newTheme);
    changeTheme({ newTheme, id });
  };

  const testNotification = async () => {
    try {
      const response = await fetch(
        "https://us-central1-my-native-fridge.cloudfunctions.net/testExpiringProducts",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        },
      );
      const result = await response.json();
      Alert.alert(
        "Test Result",
        `${result.message}\n\nCheck your notification tray!`,
      );
    } catch (error) {
      Alert.alert("Test Failed", String(error));
    }
  };

  const testDirectNotification = async () => {
    try {
      // Show alert immediately and send request in background
      Alert.alert(
        "Direct Test",
        "⏱️ Notification will arrive in 5 seconds!\n\nMinimize the app now to test background notifications.",
      );

      // Send request in background (don't await)
      fetch(
        "https://us-central1-my-native-fridge.cloudfunctions.net/testDirectNotification",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: id }),
        },
      ).catch((error) => {
        console.error("Failed to send test notification:", error);
      });
    } catch (error) {
      Alert.alert("Test Failed", String(error));
    }
  };

  const refreshFCMToken = async () => {
    try {
      const messagingInstance = getMessaging();
      const fcmToken = await getToken(messagingInstance);

      if (fcmToken) {
        // Update token in database
        const { doc, updateDoc } = await import(
          "@react-native-firebase/firestore"
        );
        const { getUsersRef } = await import("../../../src/firebase/config");

        await updateDoc(doc(getUsersRef(), id), {
          fcmToken,
        });

        Alert.alert(
          "✅ Token Updated",
          `FCM token has been refreshed!\n\nNew token: ${fcmToken.substring(0, 30)}...`,
        );
        console.log("✅ FCM token updated:", fcmToken);
      } else {
        Alert.alert("❌ Error", "Failed to get FCM token");
      }
    } catch (error) {
      Alert.alert("Update Failed", String(error));
      console.error("Token update error:", error);
    }
  };

  const debugFCM = async () => {
    try {
      // Check FCM token
      const messagingInstance = getMessaging();
      const fcmToken = await getToken(messagingInstance);
      
      // Check user notification settings
      const userSettings = await getUserNotificationSettings(id);
      
      const debugInfo = `
FCM Token: ${fcmToken ? `${fcmToken.substring(0, 30)}...` : "❌ NO TOKEN"}

User Settings:
- Notifications Enabled: ${userSettings.notificationsEnabled ? "✅ YES" : "❌ NO"}
- Onboarding Complete: ${userSettings.hasCompletedOnboarding ? "✅ YES" : "❌ NO"}

User ID: ${id}
      `.trim();

      Alert.alert("🔍 FCM Debug Info", debugInfo);
      console.log("FCM Debug Info:", { fcmToken, userSettings, userId: id });
    } catch (error) {
      Alert.alert("Debug Failed", String(error));
      console.error("FCM Debug Error:", error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <Profile />
        <LanguagePicker
          selectedLanguage={selectedLocale}
          onLanguageChange={handleLocaleChange}
          Icon={LanguageIcon}
        />
        <ThemePicker
          selectedTheme={selectedTheme}
          onThemeChange={handleThemeChange}
          Icon={BrushIcon}
        />
        <NotificationSettings />

        {/* Temporary test buttons */}
        <TouchableOpacity
          style={{
            backgroundColor: "#FF6B35",
            padding: 15,
            margin: 20,
            borderRadius: 8,
            alignItems: "center",
          }}
          onPress={testNotification}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>
            🧪 Test Notification
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: "#00C853",
            padding: 15,
            marginHorizontal: 20,
            marginBottom: 20,
            borderRadius: 8,
            alignItems: "center",
          }}
          onPress={testDirectNotification}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>
            🎯 Test Direct Notification
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: "#007AFF",
            padding: 15,
            marginHorizontal: 20,
            marginBottom: 20,
            borderRadius: 8,
            alignItems: "center",
          }}
          onPress={debugFCM}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>
            🔍 Debug FCM Setup
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: "#9C27B0",
            padding: 15,
            marginHorizontal: 20,
            marginBottom: 20,
            borderRadius: 8,
            alignItems: "center",
          }}
          onPress={refreshFCMToken}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>
            🔄 Refresh FCM Token
          </Text>
        </TouchableOpacity>

        <UserActions />
      </ScrollView>
    </View>
  );
};

export default Settings;
