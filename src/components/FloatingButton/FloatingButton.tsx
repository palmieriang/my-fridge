import { Ionicons } from "@expo/vector-icons";
import { ElementRef, forwardRef } from "react";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";

import styles from "./styles";

type FloatingButtonProps = {
  color: string;
  onPress: () => void;
  onLayout?: TouchableOpacityProps["onLayout"];
};

const FloatingButton = forwardRef<
  ElementRef<typeof TouchableOpacity>,
  FloatingButtonProps
>(({ onPress, color, onLayout }, ref) => (
  <TouchableOpacity
    ref={ref}
    style={[styles.fab, { backgroundColor: color }]}
    onPress={onPress}
    onLayout={onLayout}
    accessibilityRole="button"
    accessibilityLabel="Add item"
    testID="add-item-button"
  >
    <Ionicons
      name="add"
      size={30}
      color="white"
      importantForAccessibility="no"
    />
  </TouchableOpacity>
));

FloatingButton.displayName = "FloatingButton";

export default FloatingButton;
