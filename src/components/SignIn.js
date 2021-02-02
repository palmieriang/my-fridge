import React, { useState, useContext, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import SocialIcon from './SocialIcon';
import FormInput from './FormInput';
import LottieAnimation from '../animations/LottieAnimation';
import useToggle from './utils/useToggle';
import { adjust } from './utils/dimensions';
import { authStore } from '../store/authStore';
import UsernameIcon from './svg/UsernameIcon';
import PadlockIcon from './svg/PadlockIcon';

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
    <View style={{ flex: 1 }}>
      <KeyboardAwareScrollView
        style={{ flex: 1, width: '100%' }}
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
            style={styles.animation}
          />
        </View>
        <FormInput
          labelValue={email}
          onChangeText={setEmail}
          placeholderText="Email"
          Icon={UsernameIcon}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
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
              autoCorrect={false}
              underlineColorAndroid="transparent"
              secureTextEntry
            />
          </Animated.View>
        )}
        <TouchableOpacity
          onPress={isToggled ? handleSignIn : handleResetPassword}
          style={styles.button}
        >
          <Text style={styles.buttonTitle}>
            {isToggled ? 'Sign in' : 'Reset password'}
          </Text>
        </TouchableOpacity>
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
        </View>
        <View style={styles.footerView}>
          <Text style={styles.footerText}>Sign In with: </Text>
          <SocialIcon />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#48bbec',
    borderRadius: 5,
    justifyContent: 'center',
    height: 48,
    marginLeft: 30,
    marginRight: 30,
    marginTop: 10,
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
  animationContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  animation: {
    height: 280,
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
    marginBottom: 20,
  },
  footerLink: {
    color: '#48bbec',
    fontFamily: 'OpenSans-Bold',
    fontSize: adjust(13),
  },
});

export default SignIn;
