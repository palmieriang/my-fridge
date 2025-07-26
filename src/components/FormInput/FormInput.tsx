import { FC } from "react";
import { View, TextInput, TextInputProps, Text } from "react-native";
import { SvgProps } from "react-native-svg";

import styles from "./styles";

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
  return (
    <View
      style={styles.inputContainer}
      accessible
      accessibilityLabel={placeholderText}
    >
      <View style={styles.iconStyle}>
        <Icon width={25} height={25} fill={showError ? "#dd2c00" : "black"} />
      </View>
      <TextInput
        autoCapitalize="none"
        numberOfLines={1}
        placeholder={placeholderText}
        placeholderTextColor="#757575"
        style={[styles.input, showError && styles.inputError]}
        value={labelValue}
        {...rest}
      />
      {showError && error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default FormInput;
