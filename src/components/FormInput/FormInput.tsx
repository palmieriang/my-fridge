import { FC, useContext } from "react";
import { View, TextInput, TextInputProps, Text } from "react-native";
import { SvgProps } from "react-native-svg";

import styles from "./styles";
import { COLORS } from "../../constants/colors";
import { themeStore } from "../../store";

type FormInputProps = TextInputProps & {
  labelValue: string;
  placeholderText: string;
  Icon: FC<SvgProps>;
  error?: string;
  showError?: boolean;
};

const FormInput = ({
  labelValue,
  placeholderText,
  Icon,
  error,
  showError = false,
  ...rest
}: FormInputProps) => {
  const { theme } = useContext(themeStore);

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
      {showError && error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default FormInput;
