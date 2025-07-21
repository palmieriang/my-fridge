import "react-native-gesture-handler";
import Loading from "@components/Loading/Loading";
import { registerRootComponent } from "expo";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";

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
        console.log("[Firebase] services initialized successfully.");
      } catch (error) {
        console.error("Failed to initialize Firebase services:", error);
        setFirebaseReady(true);
      }
    };

    initFirebase();
  }, []);

  if (!fontsLoaded || !firebaseReady) {
    return <Loading size="large" />;
  }

  return <AppContainer />;
}

registerRootComponent(App);
