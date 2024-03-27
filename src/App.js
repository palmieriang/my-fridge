import "react-native-gesture-handler";
import { registerRootComponent } from "expo";
import { useFonts } from "expo-font";
import React from "react";

import AppContainer from "./AppContainer";
import { customFonts } from "./typography/typography";

export default function App() {
  const [fontsLoaded] = useFonts(customFonts);

  if (!fontsLoaded) {
    return null;
  }

  return <AppContainer />;
}

registerRootComponent(App);
