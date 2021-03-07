import React, { useState, useContext, useRef } from 'react';
import { Animated, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { authStore } from '../../store/authStore';
import SocialIcon from '@components/SocialIcon/SocialIcon';
import FormInput from '@components/FormInput/FormInput';
import Button from '@components/Button/Button';
import useToggle from '@components/utils/useToggle';
import UsernameIcon from '@components/svg/UsernameIcon';
import PadlockIcon from '@components/svg/PadlockIcon';
import LottieAnimation from '../../animations/LottieAnimation';
import styles from './styles';

const SignIn = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [playAnimation, setPlayAnimation] = useState(false);
  const [resetAnimation, setResetAnimation] = useState(false);
  const [isToggled, toggle] = useToggle(true);

  const { authContext } = useContext(authStore);

  const fadeAnim = useRef(new Animated.Value(1)).current;

  const fadeIn = () => {
    toggle();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false,
    }).start(() => {
      toggle();
    });
  };

  const handleSignIn = () => {
    if (email.length > 3 && password.length > 3) {
      setPlayAnimation(true);
    }
  };

  const signInAfterAnimation = () => {
    authContext.signIn({ email, password });
    setPlayAnimation(false);
    setResetAnimation(true);
  };

  const handleResetPassword = async () => {
    try {
      authContext.resetPassword(email);
    } catch (error) {
      console.log(error);
    }
    fadeIn();
  };

  const handleCreateAccount = () => {
    navigation.navigate('registration');
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      keyboardShouldPersistTaps="always"
    >
      <View style={styles.animationContainer}>
        <LottieAnimation
          animationEnd={signInAfterAnimation}
          autoplay={false}
          loop={false}
          name="door"
          play={playAnimation}
          reset={resetAnimation}
        />
      </View>
      <FormInput
        labelValue={email}
        onChangeText={setEmail}
        placeholderText="Email"
        Icon={UsernameIcon}
        keyboardType="email-address"
        autoCapitalize="none"
        underlineColorAndroid="transparent"
      />
      {isToggled && (
        <Animated.View
          style={{
            opacity: fadeAnim,
          }}
        >
          <FormInput
            labelValue={password}
            onChangeText={setPassword}
            placeholderText="Password"
            Icon={PadlockIcon}
            autoCapitalize="none"
            underlineColorAndroid="transparent"
            secureTextEntry
          />
        </Animated.View>
      )}
      <Button
        text={isToggled ? 'Sign in' : 'Reset password'}
        onPress={isToggled ? handleSignIn : handleResetPassword}
      />
      <View style={styles.footerView}>
        <Text style={styles.footerText}>
          New user?{' '}
          <Text onPress={handleCreateAccount} style={styles.footerLink}>
            Create an account
          </Text>
        </Text>
        <Text
          onPress={isToggled ? fadeOut : fadeIn}
          style={{ ...styles.footerLink, marginBottom: 10 }}
        >
          {isToggled ? 'Reset password' : 'Login'}
        </Text>
        <Text style={styles.footerText}>Sign In with: </Text>
        <SocialIcon />
      </View>
    </KeyboardAwareScrollView>
  );
};

export default SignIn;
