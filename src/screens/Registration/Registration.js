import React, { useState, useContext } from 'react';
import { Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FormInput from '../../components/FormInput/FormInput';
import Button from '../../components/Button/Button';
import { authStore } from '../../store/authStore';
import UsernameIcon from '../../components/svg/UsernameIcon';
import PadlockIcon from '../../components/svg/PadlockIcon';
import EmailIcon from '../../components/svg/EmailIcon';
import styles from './styles';

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
    <KeyboardAwareScrollView
      style={styles.container}
      keyboardShouldPersistTaps="always"
    >
      <FormInput
        labelValue={fullName}
        onChangeText={setFullName}
        placeholderText="Full Name"
        Icon={UsernameIcon}
        autoCapitalize="none"
        underlineColorAndroid="transparent"
      />
      <FormInput
        labelValue={email}
        onChangeText={setEmail}
        placeholderText="Email"
        Icon={EmailIcon}
        keyboardType="email-address"
        autoCapitalize="none"
        underlineColorAndroid="transparent"
      />
      <FormInput
        labelValue={password}
        onChangeText={setPassword}
        placeholderText="Password"
        Icon={PadlockIcon}
        autoCapitalize="none"
        underlineColorAndroid="transparent"
        secureTextEntry
      />
      <FormInput
        labelValue={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholderText="Password"
        Icon={PadlockIcon}
        autoCapitalize="none"
        underlineColorAndroid="transparent"
        secureTextEntry
      />
      <Button text={'Create account'} onPress={handleRegistration} />
      <View style={styles.footerView}>
        <Text style={styles.footerText}>
          Already got an account?{' '}
          <Text onPress={handleGoToLogin} style={styles.footerLink}>
            Log in
          </Text>
        </Text>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default Registration;
