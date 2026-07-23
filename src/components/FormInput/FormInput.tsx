import { Ionicons } from "@expo/vector-icons";
import { FC, forwardRef } from "react";
import {
  View,
  TextInput,
  TextInputProps,
  Text,
  TouchableOpacity,
  ViewProps,
} from "react-native";
import { SvgProps } from "react-native-svg";

import styles from "./styles";
import { COLORS } from "../../constants/colors";
import { useLocale, useTheme } from "../../store";

type FormInputProps = TextInputProps & {
  labelValue: string;
  placeholderText: string;
  Icon: FC<SvgProps>;
  error?: string;
  showError?: boolean;
  showPasswordToggle?: boolean;
  isPasswordVisible?: boolean;
  onTogglePasswordVisibility?: () => void;
  containerOnLayout?: ViewProps["onLayout"];
};

const FormInput = forwardRef<View, FormInputProps>(
  (
    {
      labelValue,
      placeholderText,
      Icon,
      error,
      showError = false,
      showPasswordToggle = false,
      isPasswordVisible = false,
      onTogglePasswordVisibility,
      containerOnLayout,
      ...rest
    },
    ref,
  ) => {
    const { theme } = useTheme();
    const { t } = useLocale();

    return (
      <View
        ref={ref}
        onLayout={containerOnLayout}
        style={[
          styles.inputContainer,
          { backgroundColor: theme.foreground },
          showError && styles.inputError,
        ]}
      >
        <View
          style={styles.iconStyle}
          importantForAccessibility="no-hide-descendants"
          accessibilityElementsHidden={true}
        >
          <Icon
            width={25}
            height={25}
            fill={showError ? COLORS.ERROR : theme.text}
          />
        </View>
        <TextInput
          autoCapitalize="none"
          numberOfLines={1}
          placeholder={placeholderText}
          placeholderTextColor={COLORS.DARK_GRAY}
          style={[styles.input, { color: theme.text }]}
          value={labelValue}
          accessibilityLabel={placeholderText}
          {...rest}
        />
        {showPasswordToggle && (
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={onTogglePasswordVisibility}
            accessible
            accessibilityLabel={
              isPasswordVisible ? t("hidePassword") : t("showPassword")
            }
          >
            <Ionicons
              name={isPasswordVisible ? "eye-off" : "eye"}
              size={20}
              color={theme.text}
            />
          </TouchableOpacity>
        )}
        {showError && error && (
          <Text
            style={styles.errorText}
            accessibilityRole="alert"
            accessibilityLiveRegion="assertive"
          >
            {error}
          </Text>
        )}
      </View>
    );
  },
);

FormInput.displayName = "FormInput";

export default FormInput;
