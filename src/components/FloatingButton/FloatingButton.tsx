import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

import styles from "./styles";

type FloatingButtonProps = {
  color: string;
  onPress: () => void;
};

const FloatingButton = ({ onPress, color }: FloatingButtonProps) => (
  <TouchableOpacity
    style={[styles.fab, { backgroundColor: color }]}
    onPress={onPress}
    accessibilityLabel="Add item"
    testID="add-item-button"
  >
    <Ionicons name="add" size={30} color="white" />
  </TouchableOpacity>
);

export default FloatingButton;
