import {
  getMessaging,
  requestPermission,
  getToken,
  AuthorizationStatus,
} from "@react-native-firebase/messaging";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  PermissionsAndroid,
  Platform,
} from "react-native";

const NotificationDebug: React.FC = () => {
  const [permissionStatus, setPermissionStatus] = useState<string>("unknown");
  const [fcmToken, setFcmToken] = useState<string>("");
  const [notificationEnabled, setNotificationEnabled] =
    useState<boolean>(false);

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    try {
      const messagingInstance = getMessaging();
      const authStatus = await requestPermission(messagingInstance);

      let statusText = "unknown";
      switch (authStatus) {
        case AuthorizationStatus.AUTHORIZED:
          statusText = "AUTHORIZED ✅";
          setNotificationEnabled(true);
          break;
        case AuthorizationStatus.PROVISIONAL:
          statusText = "PROVISIONAL ⚠️";
          setNotificationEnabled(true);
          break;
        case AuthorizationStatus.DENIED:
          statusText = "DENIED ❌";
          setNotificationEnabled(false);
          break;
        case AuthorizationStatus.NOT_DETERMINED:
          statusText = "NOT_DETERMINED ❓";
          setNotificationEnabled(false);
          break;
        default:
          statusText = `UNKNOWN (${authStatus}) ❓`;
          setNotificationEnabled(false);
      }

      setPermissionStatus(statusText);

      if (
        authStatus === AuthorizationStatus.AUTHORIZED ||
        authStatus === AuthorizationStatus.PROVISIONAL
      ) {
        const token = await getToken(messagingInstance);
        setFcmToken(token || "No token received");
        console.log("FCM Token:", token);
      }
    } catch (error) {
      console.error("Error checking permissions:", error);
      setPermissionStatus("ERROR ❌");
    }
  };

  const requestAndroidPermission = async () => {
    if (Platform.OS === "android" && Platform.Version >= 33) {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          {
            title: "Notification Permission",
            message: "This app needs permission to send notifications",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("Android notification permission granted");
          await checkPermissions();
        } else {
          console.log("Android notification permission denied");
          Alert.alert(
            "Permission Required",
            "Please enable notifications in Settings > Apps > My Fridge > Notifications",
          );
        }
      } catch (err) {
        console.warn("Error requesting Android permission:", err);
      }
    }
  };

  const openAppSettings = () => {
    Alert.alert(
      "Enable Notifications",
      "To receive notifications:\n\n1. Go to Settings > Apps > My Fridge\n2. Tap Notifications\n3. Turn on \"Allow notifications\"\n\nThen restart the app.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Open Settings",
          onPress: () => {
            // On Android emulator, user needs to manually navigate
            console.log("Please manually open Android Settings");
          },
        },
      ],
    );
  };

  const testNotification = async () => {
    if (!notificationEnabled) {
      Alert.alert("Error", "Notifications are not enabled");
      return;
    }

    try {
      // Test manual trigger endpoint
      const response = await fetch(
        "https://us-central1-my-native-fridge.cloudfunctions.net/testExpiringProducts",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        },
      );

      const result = await response.json();
      Alert.alert("Test Result", JSON.stringify(result, null, 2));
    } catch (error) {
      console.error("Test notification error:", error);
      Alert.alert("Test Failed", String(error));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔔 Notification Debug</Text>
      
      <View style={styles.section}>
        <Text style={styles.label}>Permission Status:</Text>
        <Text style={styles.value}>{permissionStatus}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>FCM Token:</Text>
        <Text style={styles.value} numberOfLines={3}>
          {fcmToken || 'No token'}
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={requestAndroidPermission}>
        <Text style={styles.buttonText}>Request Android Permission</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={checkPermissions}>
        <Text style={styles.buttonText}>Refresh Status</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={openAppSettings}>
        <Text style={styles.buttonText}>Open App Settings Guide</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, !notificationEnabled && styles.buttonDisabled]} 
        onPress={testNotification}
        disabled={!notificationEnabled}
      >
        <Text style={styles.buttonText}>Test Notification</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  value: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NotificationDebug;