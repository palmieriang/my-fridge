import React from "react";
import { View, TextInput } from "react-native";

import styles from "./styles";

type FormInputProps = {
  labelValue: string;
  placeholderText: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
};

const FormInput = ({
  labelValue,
  placeholderText,
  Icon,
  ...rest
}: FormInputProps) => {
  return (
    <View
      style={styles.inputContainer}
      accessible
      accessibilityLabel={placeholderText}
    >
      <View style={styles.iconStyle}>
        <Icon width={25} height={25} fill="black" />
      </View>
      <TextInput
        autoCapitalize="none"
        numberOfLines={1}
        placeholder={placeholderText}
        placeholderTextColor="#757575"
        style={styles.input}
        value={labelValue}
        {...rest}
      />
    </View>
  );
};

export default FormInput;
