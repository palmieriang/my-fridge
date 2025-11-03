import React, { useEffect, useState, useContext } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import {
  getMessaging,
  requestPermission,
  getToken,
  AuthorizationStatus,
} from "@react-native-firebase/messaging";
import { doc, getDoc } from "@react-native-firebase/firestore";
import { getUsersRef } from "../../firebase/config";
import { authStore } from "../../store";

const FCMDebugger: React.FC = () => {
  const { authState } = useContext(authStore);
  const userId = authState.user?.uid;
  
  const [fcmToken, setFcmToken] = useState<string>("");
  const [permissionStatus, setPermissionStatus] = useState<string>("");
  const [userDbData, setUserDbData] = useState<any>(null);

  useEffect(() => {
    if (userId) {
      checkEverything();
    }
  }, [userId]);

  const checkEverything = async () => {
    try {
      // 1. Check FCM permission and token
      const messagingInstance = getMessaging();
      const authStatus = await requestPermission(messagingInstance);
      
      let statusText = "";
      switch (authStatus) {
        case AuthorizationStatus.AUTHORIZED:
          statusText = "AUTHORIZED ✅";
          break;
        case AuthorizationStatus.PROVISIONAL:
          statusText = "PROVISIONAL ⚠️";
          break;
        case AuthorizationStatus.DENIED:
          statusText = "DENIED ❌";
          break;
        default:
          statusText = `UNKNOWN (${authStatus}) ❓`;
      }
      setPermissionStatus(statusText);

      if (authStatus === AuthorizationStatus.AUTHORIZED || authStatus === AuthorizationStatus.PROVISIONAL) {
        const token = await getToken(messagingInstance);
        setFcmToken(token || "No token received");
        console.log("🔑 Current FCM Token:", token);
      }

      // 2. Check user data in Firestore
      if (userId) {
        const userDocRef = doc(getUsersRef(), userId);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserDbData(userData);
          console.log("👤 User DB Data:", {
            notificationsEnabled: userData?.notificationsEnabled,
            hasToken: !!userData?.fcmToken,
            tokenMatch: userData?.fcmToken === token,
          });
        }
      }
    } catch (error) {
      console.error("❌ Error in checkEverything:", error);
      Alert.alert("Error", String(error));
    }
  };

  const updateFCMToken = async () => {
    if (!userId || !fcmToken) {
      Alert.alert("Error", "No user ID or FCM token");
      return;
    }

    try {
      const { updateDoc } = await import("@react-native-firebase/firestore");
      await updateDoc(doc(getUsersRef(), userId), {
        fcmToken: fcmToken,
        notificationsEnabled: true,
        hasCompletedOnboarding: true,
      });
      
      Alert.alert("Success", "FCM token updated in database");
      await checkEverything(); // Refresh data
    } catch (error) {
      console.error("❌ Error updating FCM token:", error);
      Alert.alert("Error", String(error));
    }
  };

  const testNotificationManual = async () => {
    try {
      const response = await fetch(
        "https://us-central1-my-native-fridge.cloudfunctions.net/testExpiringProducts",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );
      const result = await response.json();
      
      Alert.alert(
        "Test Result", 
        `${result.message}\n\nNotifications sent: ${result.data?.totalNotificationsSent || 0}\n\nIf you don't see a notification, check the FCM token matches below.`
      );
    } catch (error) {
      Alert.alert("Test Failed", String(error));
    }
  };

  const checkTokenMatch = () => {
    const dbToken = userDbData?.fcmToken;
    const currentToken = fcmToken;
    
    if (!dbToken || !currentToken) {
      return "❓ Missing token data";
    }
    
    return dbToken === currentToken ? "✅ Tokens match" : "❌ Tokens don't match";
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔍 FCM Debug Info</Text>
      
      <View style={styles.section}>
        <Text style={styles.label}>User ID:</Text>
        <Text style={styles.value}>{userId || "No user"}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Permission Status:</Text>
        <Text style={styles.value}>{permissionStatus}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Current FCM Token:</Text>
        <Text style={styles.value} numberOfLines={3}>
          {fcmToken || "No token"}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>DB Notifications Enabled:</Text>
        <Text style={styles.value}>
          {userDbData?.notificationsEnabled ? "✅ Yes" : "❌ No"}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>DB FCM Token:</Text>
        <Text style={styles.value} numberOfLines={3}>
          {userDbData?.fcmToken ? `${userDbData.fcmToken.substring(0, 30)}...` : "❌ No token in DB"}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Token Match:</Text>
        <Text style={styles.value}>{checkTokenMatch()}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={checkEverything}>
        <Text style={styles.buttonText}>🔄 Refresh Data</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={updateFCMToken}>
        <Text style={styles.buttonText}>💾 Update FCM Token in DB</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={testNotificationManual}>
        <Text style={styles.buttonText}>🧪 Test Notification</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  section: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 3,
    color: "#333",
  },
  value: {
    fontSize: 11,
    color: "#666",
    fontFamily: "monospace",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default FCMDebugger;