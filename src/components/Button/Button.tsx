import { useContext } from "react";
import { Text, TouchableOpacity } from "react-native";

import styles from "./styles";
import { themeStore } from "../../store";

type ButtonProps = {
  text: string;
  onPress: () => void;
  variant?: "primary" | "danger" | "secondary";
};

const Button = ({ text, onPress, variant = "primary" }: ButtonProps) => {
  const { theme } = useContext(themeStore);

  const getButtonStyle = () => {
    switch (variant) {
      case "danger":
        return styles.buttonDanger;
      case "secondary":
        return styles.buttonSecondary;
      case "primary":
      default:
        return [styles.button, { backgroundColor: theme.primary }];
    }
  };

  const getTextStyle = () => {
    if (variant === "secondary") {
      return [styles.buttonTitle, { color: theme.text }];
    }
    return styles.buttonTitle;
  };

  return (
    <TouchableOpacity onPress={onPress} style={getButtonStyle()}>
      <Text style={getTextStyle()}>{text}</Text>
    </TouchableOpacity>
  );
};

export default Button;
