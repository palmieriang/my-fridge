import React, { useState, useContext } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { authStore } from '../store/authStore';
import UsernameIcon from '../../assets/username.svg';
import PadlockIcon from '../../assets/padlock.svg';
import EmailIcon from '../../assets/email.svg';

const Registration = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { authContext } = useContext(authStore);

  const handleRegistration = () => {
    authContext
      .signUp({ fullName, email, password, confirmPassword })
      .then(() => navigation.navigate('signin'));
  };

  const handleGoToLogin = () => {
    navigation.navigate('signin');
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={{ flex: 1, width: '100%' }}
        keyboardShouldPersistTaps="always"
      >
        <View style={styles.inputContainer}>
          <View style={styles.iconStyle}>
            <UsernameIcon width={25} height={25} fill="black" />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#aaaaaa"
            onChangeText={setFullName}
            value={fullName}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.iconStyle}>
            <EmailIcon width={25} height={25} fill="black" />
          </View>
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            placeholderTextColor="#aaaaaa"
            onChangeText={setEmail}
            value={email}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.iconStyle}>
            <PadlockIcon width={25} height={25} fill="black" />
          </View>
          <TextInput
            style={styles.input}
            placeholderTextColor="#aaaaaa"
            secureTextEntry
            placeholder="Password"
            onChangeText={setPassword}
            value={password}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.iconStyle}>
            <PadlockIcon width={25} height={25} fill="black" />
          </View>
          <TextInput
            style={styles.input}
            placeholderTextColor="#aaaaaa"
            secureTextEntry
            placeholder="Confirm Password"
            onChangeText={setConfirmPassword}
            value={confirmPassword}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleRegistration}>
          <Text style={styles.buttonTitle}>Create account</Text>
        </TouchableOpacity>
        <View style={styles.footerView}>
          <Text style={styles.footerText}>
            Already got an account?{' '}
            <Text onPress={handleGoToLogin} style={styles.footerLink}>
              Log in
            </Text>
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
  },
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
  button: {
    alignItems: 'center',
    backgroundColor: '#48BBEC',
    borderRadius: 5,
    justifyContent: 'center',
    height: 48,
    marginLeft: 30,
    marginRight: 30,
    marginTop: 20,
  },
  buttonTitle: {
    color: 'white',
    fontFamily: 'OpenSansBold',
    fontSize: 16,
    textTransform: 'uppercase',
  },
  footerView: {
    alignItems: 'center',
    flex: 1,
    marginTop: 20,
  },
  footerText: {
    color: '#2e2e2d',
    fontFamily: 'OpenSansRegular',
    fontSize: 16,
  },
  footerLink: {
    color: '#48BBEC',
    fontFamily: 'OpenSansBold',
    fontSize: 16,
  },
});

export default Registration;
