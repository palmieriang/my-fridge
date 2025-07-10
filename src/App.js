import "react-native-gesture-handler";
import { registerRootComponent } from "expo";
import { useFonts } from "expo-font";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";

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
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return <AppContainer />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

registerRootComponent(App);
