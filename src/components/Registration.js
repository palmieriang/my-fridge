import React, { useState, useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FormInput from './FormInput';
import { adjust } from './utils/dimensions';
import { authStore } from '../store/authStore';
import UsernameIcon from './svg/UsernameIcon';
import PadlockIcon from './svg/PadlockIcon';
import EmailIcon from './svg/EmailIcon';

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
        <FormInput
          labelValue={fullName}
          onChangeText={setFullName}
          placeholderText="Full Name"
          Icon={UsernameIcon}
          autoCapitalize="none"
          autoCorrect={false}
          underlineColorAndroid="transparent"
        />
        <FormInput
          labelValue={email}
          onChangeText={setEmail}
          placeholderText="Email"
          Icon={EmailIcon}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          underlineColorAndroid="transparent"
        />
        <FormInput
          labelValue={password}
          onChangeText={setPassword}
          placeholderText="Password"
          Icon={PadlockIcon}
          autoCapitalize="none"
          autoCorrect={false}
          underlineColorAndroid="transparent"
          secureTextEntry
        />
        <FormInput
          labelValue={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholderText="Password"
          Icon={PadlockIcon}
          autoCapitalize="none"
          autoCorrect={false}
          underlineColorAndroid="transparent"
          secureTextEntry
        />
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
    color: '#fff',
    fontFamily: 'OpenSans-Bold',
    fontSize: adjust(15),
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0,
    textTransform: 'uppercase',
  },
  footerView: {
    alignItems: 'center',
    flex: 1,
    marginTop: 20,
  },
  footerText: {
    color: '#2e2e2d',
    fontFamily: 'OpenSans-Regular',
    fontSize: adjust(13),
  },
  footerLink: {
    color: '#48BBEC',
    fontFamily: 'OpenSans-Bold',
    fontSize: adjust(13),
  },
});

export default Registration;
