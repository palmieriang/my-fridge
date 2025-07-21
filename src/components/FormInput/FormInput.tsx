import { FC } from "react";
import { View, TextInput, TextInputProps } from "react-native";
import { SvgProps } from "react-native-svg";

import styles from "./styles";

type FormInputProps = TextInputProps & {
  labelValue: string;
  placeholderText: string;
  Icon: FC<SvgProps>;
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
