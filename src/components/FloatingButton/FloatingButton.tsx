// import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, Text } from "react-native";

import styles from "./styles";

type FloatingButtonProps = {
  color: string;
  onPress: () => void;
};

const FloatingButton = ({ onPress, color }: FloatingButtonProps) => (
  <TouchableOpacity
    style={[styles.fab, { backgroundColor: color }]}
    onPress={onPress}
  >
    <Text style={{ color: "white", fontSize: 24 }}>+</Text>
    {/* <Ionicons name="add" size={24} color="white" /> */}
  </TouchableOpacity>
);

export default FloatingButton;
