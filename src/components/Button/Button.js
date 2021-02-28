import React from 'react';
import PropTypes from 'prop-types';
import { Text, TouchableOpacity } from 'react-native';
import styles from './styles';

const FormInput = ({ text, onPress, buttonDelete }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, buttonDelete && styles.buttonDelete]}
    >
      <Text style={styles.buttonTitle}>{text}</Text>
    </TouchableOpacity>
  );
};

FormInput.propTypes = {
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  buttonDelete: PropTypes.bool,
};

FormInput.defaultProps = {
  buttonDelete: false,
};

export default FormInput;
