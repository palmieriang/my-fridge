import React from 'react';
import PropTypes from 'prop-types';
import { View, TextInput } from 'react-native';
import styles from './styles';

const FormInput = ({ labelValue, placeholderText, Icon, ...rest }) => {
  return (
    <View
      style={styles.inputContainer}
      accessible={true}
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

FormInput.propTypes = {
  labelValue: PropTypes.string.isRequired,
  placeholderText: PropTypes.string.isRequired,
  Icon: PropTypes.func.isRequired,
};

export default FormInput;
