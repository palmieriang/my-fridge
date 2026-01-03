import "react-native-gesture-handler";
import Loading from "@components/Loading/Loading";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";

import AppContainer from "./AppContainer";
import { setupNotificationListeners } from "../api/api";
import { initializeFirebaseServices } from "./firebase/config";
import { customFonts } from "./typography/typography";

export default function App() {
  const [fontsLoaded] = useFonts(customFonts);
  const [firebaseReady, setFirebaseReady] = useState(false);

  useEffect(() => {
    let notificationUnsubscribe: (() => void) | null = null;

    const initFirebase = async (): Promise<void> => {
      console.log("[App] Firebase init started");
      try {
        await initializeFirebaseServices();
        setFirebaseReady(true);
        console.log("[Firebase] services initialized successfully.");

        // Setup notification listeners after Firebase is ready
        notificationUnsubscribe = setupNotificationListeners();
        console.log("[Notifications] Listeners setup complete");
      } catch (error) {
        console.error("Failed to initialize Firebase services:", error);
        setFirebaseReady(true);
      }
    };

    initFirebase();

    // Cleanup function
    return () => {
      if (notificationUnsubscribe) {
        notificationUnsubscribe();
        console.log("[Notifications] Listeners cleaned up");
      }
    };
  }, []);

  if (!fontsLoaded || !firebaseReady) {
    return <Loading size="large" />;
  }

  return <AppContainer />;
}
