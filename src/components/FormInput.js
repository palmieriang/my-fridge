import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

const FormInput = ({ labelValue, placeholderText, Icon, ...rest }) => {
  return (
    <View style={styles.inputContainer}>
      <View style={styles.iconStyle}>
        <Icon width={25} height={25} fill="black" />
      </View>
      <TextInput
        autoCapitalize="none"
        numberOfLines={1}
        placeholder={placeholderText}
        placeholderTextColor="#aaaaaa"
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
    borderWidth: 1,
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
    borderRightWidth: 1,
    padding: 14,
  },
  input: {
    backgroundColor: 'white',
    flex: 1,
    fontFamily: 'OpenSansRegular',
    justifyContent: 'center',
    padding: 14,
  },
});

export default FormInput;
