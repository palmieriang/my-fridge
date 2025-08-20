import { useContext } from "react";
import { Text, TouchableOpacity } from "react-native";

import styles from "./styles";
import { themeStore } from "../../store";

type ButtonProps = {
  text: string;
  onPress: () => void;
  variant?: "primary" | "danger";
};

const Button = ({ text, onPress, variant = "primary" }: ButtonProps) => {
  const { theme } = useContext(themeStore);

  const getButtonStyle = () => {
    switch (variant) {
      case "danger":
        return styles.buttonDanger;
      case "primary":
      default:
        return [styles.button, { backgroundColor: theme.primary }];
    }
  };

  return (
    <TouchableOpacity onPress={onPress} style={getButtonStyle()}>
      <Text style={styles.buttonTitle}>{text}</Text>
    </TouchableOpacity>
  );
};

export default Button;
