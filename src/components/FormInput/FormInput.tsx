import { Ionicons } from "@expo/vector-icons";
import { FC, useContext } from "react";
import {
  View,
  TextInput,
  TextInputProps,
  Text,
  TouchableOpacity,
} from "react-native";
import { SvgProps } from "react-native-svg";

import styles from "./styles";
import { COLORS } from "../../constants/colors";
import { localeStore, themeStore } from "../../store";

type FormInputProps = TextInputProps & {
  labelValue: string;
  placeholderText: string;
  Icon: FC<SvgProps>;
  error?: string;
  showError?: boolean;
  showPasswordToggle?: boolean;
  isPasswordVisible?: boolean;
  onTogglePasswordVisibility?: () => void;
};

const FormInput = ({
  labelValue,
  placeholderText,
  Icon,
  error,
  showError = false,
  showPasswordToggle = false,
  isPasswordVisible = false,
  onTogglePasswordVisibility,
  ...rest
}: FormInputProps) => {
  const { theme } = useContext(themeStore);
  const {
    localizationContext: { t },
  } = useContext(localeStore);

  return (
    <View
      style={[
        styles.inputContainer,
        { backgroundColor: theme.foreground },
        showError && styles.inputError,
      ]}
      accessible
      accessibilityLabel={placeholderText}
    >
      <View style={styles.iconStyle}>
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
            name={isPasswordVisible ? "eye" : "eye-off"}
            size={20}
            color={theme.text}
          />
        </TouchableOpacity>
      )}
      {showError && error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default FormInput;
