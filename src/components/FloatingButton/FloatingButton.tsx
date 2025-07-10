// import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

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

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
});

export default FloatingButton;
