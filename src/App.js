import "react-native-gesture-handler";
import { registerRootComponent } from "expo";
import { useFonts } from "expo-font";
import React from "react";
import { LogBox } from "react-native";

import AppContainer from "./AppContainer";
import { customFonts } from "./typography/typography";

LogBox.ignoreLogs([
  "Warning: componentWillMount is deprecated",
  "Warning: componentWillReceiveProps has been renamed",
  "Warning: Setting a timer",
]);

export default function App() {
  const [fontsLoaded] = useFonts(customFonts);

  if (!fontsLoaded) {
    return null;
  }

  return <AppContainer />;
}

registerRootComponent(App);
