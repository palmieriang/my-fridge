import React from 'react';
import PropTypes from 'prop-types';
import { View, TextInput, StyleSheet } from 'react-native';
import { adjust } from './utils/dimensions';

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

const styles = StyleSheet.create({
  inputContainer: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderRadius: 5,
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 30,
    marginRight: 30,
    maxHeight: 56,
    overflow: 'hidden',
  },
  iconStyle: {
    alignItems: 'center',
    borderRightColor: '#ccc',
    borderRightWidth: StyleSheet.hairlineWidth,
    padding: 14,
  },
  input: {
    backgroundColor: 'white',
    flex: 1,
    fontFamily: 'OpenSans-Regular',
    fontSize: adjust(14),
    justifyContent: 'center',
    padding: 14,
  },
});

FormInput.propTypes = {
  labelValue: PropTypes.string.isRequired,
  placeholderText: PropTypes.string.isRequired,
  Icon: PropTypes.func.isRequired,
};

export default FormInput;
