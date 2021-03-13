import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import styles from './styles';

type ButtonProps = {
  text: string;
  onPress: () => void;
  buttonDelete?: boolean;
};

const Button = ({ text, onPress, buttonDelete = false }: ButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, buttonDelete && styles.buttonDelete]}
    >
      <Text style={styles.buttonTitle}>{text}</Text>
    </TouchableOpacity>
  );
};

export default Button;
