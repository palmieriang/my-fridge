import { Text, TouchableOpacity } from "react-native";

import styles from "./styles";
import { useTheme } from "../../store";

type ButtonProps = {
  text: string;
  onPress: () => void;
  variant?: "primary" | "danger";
  disabled?: boolean;
};

const Button = ({
  text,
  onPress,
  variant = "primary",
  disabled = false,
}: ButtonProps) => {
  const { theme } = useTheme();

  const getButtonStyle = () => {
    const baseStyle = (() => {
      switch (variant) {
        case "danger":
          return styles.buttonDanger;
        case "primary":
        default:
          return [styles.button, { backgroundColor: theme.primary }];
      }
    })();

    if (disabled) {
      return [baseStyle, styles.buttonDisabled];
    }

    return baseStyle;
  };

  const getTextStyle = () => {
    if (disabled) {
      return [styles.buttonTitle, styles.buttonTitleDisabled];
    }
    return styles.buttonTitle;
  };

  return (
    <TouchableOpacity
      onPress={disabled ? undefined : onPress}
      style={getButtonStyle()}
      disabled={disabled}
    >
      <Text style={getTextStyle()}>{text}</Text>
    </TouchableOpacity>
  );
};

export default Button;
