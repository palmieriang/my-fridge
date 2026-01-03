import { useContext } from "react";
import {
  ActivityIndicator,
  ColorValue,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";

import styles from "./styles";
import { COLORS } from "../../constants/colors";
import { ThemeStoreContext } from "../../store/contexts";

type LoadingProps = {
  color?: ColorValue;
  size?: number | "small" | "large" | undefined;
  style?: StyleProp<ViewStyle>;
};

const Loading = ({ color, size, style }: LoadingProps) => {
  // Use useContext directly to allow rendering outside ThemeProvider
  const themeContext = useContext(ThemeStoreContext);
  const primaryColor = themeContext?.theme?.primary ?? COLORS.PRIMARY_RED;

  return (
    <View style={[styles.loadingContainer, style]}>
      <ActivityIndicator
        size={size}
        color={color || primaryColor}
        testID="activity-indicator"
      />
    </View>
  );
};

export default Loading;
