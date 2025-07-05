import "react-native-gesture-handler";
import { registerRootComponent } from "expo";
import { useFonts } from "expo-font";
import React, { useEffect, useState } from "react";

import AppContainer from "./AppContainer";
import { initializeFirebaseServices } from "./firebase/config";
import { customFonts } from "./typography/typography";

export default function App() {
  const [fontsLoaded] = useFonts(customFonts);
  const [firebaseReady, setFirebaseReady] = useState(false);

  useEffect(() => {
    const initFirebase = async () => {
      console.log("[App] Firebase init started");
      try {
        await initializeFirebaseServices();
        setFirebaseReady(true);
        console.log("Firebase services initialized successfully.");
      } catch (error) {
        console.error("Failed to initialize Firebase services:", error);
        setFirebaseReady(true);
      }
    };

    initFirebase();
  }, []);

  if (!fontsLoaded || !firebaseReady) {
    return null; // or a splash/loading screen here
  }

  return <AppContainer />;
}

registerRootComponent(App);
