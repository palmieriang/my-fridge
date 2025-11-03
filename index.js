/**
 * Root entry point for the React Native app
 * This file is required for Firebase background message handling
 */

import {
  getMessaging,
  setBackgroundMessageHandler,
} from "@react-native-firebase/messaging";
import { AppRegistry } from "react-native";

import App from "./src/App";

// Register background handler using modular API
setBackgroundMessageHandler(getMessaging(), async (remoteMessage) => {
  console.log("📱 Background notification received:", remoteMessage);
  // Background notifications are automatically displayed by the OS
  // No need to show them manually
});

// Register the app
AppRegistry.registerComponent("main", () => App);
