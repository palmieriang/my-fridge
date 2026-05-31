import { forwardRef } from "react";
import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";

import styles from "./styles";
import { useTheme } from "../../store";

type ButtonProps = {
  text: string;
  onPress: () => void;
  variant?: "primary" | "danger";
  disabled?: boolean;
  onLayout?: TouchableOpacityProps["onLayout"];
};

const Button = forwardRef<TouchableOpacity, ButtonProps>(
  (
    {
      text,
      onPress,
      variant = "primary",
      disabled = false,
      onLayout,
    }: ButtonProps,
    ref,
  ) => {
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
        ref={ref}
        onLayout={onLayout}
        onPress={disabled ? undefined : onPress}
        style={getButtonStyle()}
        disabled={disabled}
      >
        <Text style={getTextStyle()}>{text}</Text>
      </TouchableOpacity>
    );
  },
);

Button.displayName = "Button";

export default Button;
