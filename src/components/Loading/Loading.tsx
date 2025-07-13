import React, { useContext } from "react";
import {
  ActivityIndicator,
  ColorValue,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";

import styles from "./styles";
import { themeStore } from "../../store";

type LoadingProps = {
  color?: ColorValue;
  size?: number | "small" | "large" | undefined;
  style?: StyleProp<ViewStyle>;
};

const Loading = ({ color, size, style }: LoadingProps) => {
  const { theme } = useContext(themeStore);

  return (
    <View style={[styles.loadingContainer, style]}>
      <ActivityIndicator size={size} color={color || theme.primary} />
    </View>
  );
};

export default Loading;
