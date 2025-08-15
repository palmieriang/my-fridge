import { FC } from "react";
import { View, Text } from "react-native";
import { COLORS } from "src/constants/colors";

import styles from "./styles";
import { getPasswordStrength } from "../../utils/validation";

interface PasswordStrengthIndicatorProps {
  password: string;
  colorScheme?: {
    weak: string;
    fair: string;
    good: string;
    strong: string;
    default: string;
  };
}

const PasswordStrengthIndicator: FC<PasswordStrengthIndicatorProps> = ({
  password,
  colorScheme = {
    weak: COLORS.ERROR,
    fair: COLORS.WARNING,
    good: COLORS.INFO,
    strong: COLORS.SUCCESS,
    default: COLORS.DARK_GRAY,
  },
}) => {
  const passwordStrength = getPasswordStrength(password, colorScheme);

  if (password.length === 0) {
    return null;
  }

  return (
    <View style={styles.passwordStrengthContainer}>
      <View style={styles.strengthBarContainer}>
        {[1, 2, 3, 4].map((level) => (
          <View
            key={level}
            style={[
              styles.strengthBar,
              {
                backgroundColor:
                  level <= passwordStrength.strength
                    ? passwordStrength.color
                    : COLORS.LIGHT_GRAY,
              },
            ]}
          />
        ))}
      </View>
      <Text style={[styles.strengthText, { color: passwordStrength.color }]}>
        {passwordStrength.text}
      </Text>
    </View>
  );
};

export default PasswordStrengthIndicator;
