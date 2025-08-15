import Button from "@components/Button/Button";
import FormInput from "@components/FormInput/FormInput";
import SocialIcon from "@components/SocialIcon/SocialIcon";
import PadlockIcon from "@components/svg/PadlockIcon";
import UsernameIcon from "@components/svg/UsernameIcon";
import useToggle from "@components/utils/useToggle";
import { useState, useContext, useRef } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
  Alert,
  ActivityIndicator,
} from "react-native";
import { COLORS } from "src/constants/colors";

import styles from "./styles";
import LottieAnimation from "../../animations/LottieAnimation";
import { authStore } from "../../store";
import { validateEmail, validatePassword } from "../../utils/validation";

interface SignInProps {
  navigation: {
    navigate: (screen: string) => void;
  };
}

const SignIn = ({ navigation }: SignInProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [playAnimation, setPlayAnimation] = useState(false);
  const [resetAnimation, setResetAnimation] = useState(false);
  const [isToggled, toggle] = useToggle(true);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { authContext } = useContext(authStore);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;

  const fadeIn = () => {
    toggle();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      toggle();
    });
  };

  const animateButtonPress = () => {
    Animated.sequence([
      Animated.timing(buttonScaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleEmailValidation = (email: string) => {
    const result = validateEmail(email);
    setEmailError(result.error);
    return result.isValid;
  };

  const handlePasswordValidation = (password: string) => {
    const result = validatePassword(password);
    setPasswordError(result.error);
    return result.isValid;
  };

  const handleSignIn = async () => {
    const isEmailValid = handleEmailValidation(email);
    const isPasswordValid = handlePasswordValidation(password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    setIsLoading(true);
    animateButtonPress();

    setTimeout(() => {
      setPlayAnimation(true);
    }, 200);
  };

  const signInAfterAnimation = async () => {
    try {
      await authContext.signIn({ email, password });
      setPlayAnimation(false);
      setResetAnimation(true);
    } catch (error: any) {
      Alert.alert(
        "Sign In Failed",
        error?.message || "Please check your credentials and try again.",
        [{ text: "OK" }],
      );
    } finally {
      setIsLoading(false);
      setPlayAnimation(false);
      setResetAnimation(true);
    }
  };

  const handleResetPassword = async () => {
    if (!handleEmailValidation(email)) {
      return;
    }

    setIsLoading(true);
    try {
      await authContext.resetPassword(email);
      Alert.alert(
        "Password Reset",
        "Check your email for password reset instructions.",
        [{ text: "OK", onPress: fadeIn }],
      );
    } catch (error: any) {
      Alert.alert(
        "Reset Failed",
        error?.message || "Unable to send reset email. Please try again.",
        [{ text: "OK" }],
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAccount = () => {
    navigation.navigate("registration");
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError) setEmailError("");
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (passwordError) setPasswordError("");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
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

        <View style={styles.formContainer}>
          <FormInput
            labelValue={email}
            onChangeText={handleEmailChange}
            placeholderText="Email"
            Icon={UsernameIcon}
            keyboardType="email-address"
            autoCapitalize="none"
            underlineColorAndroid="transparent"
            error={emailError}
            showError={!!emailError}
          />

          {isToggled && (
            <Animated.View
              style={{
                opacity: fadeAnim,
              }}
            >
              <FormInput
                labelValue={password}
                onChangeText={handlePasswordChange}
                placeholderText="Password"
                Icon={PadlockIcon}
                autoCapitalize="none"
                underlineColorAndroid="transparent"
                secureTextEntry={!showPassword}
                showPasswordToggle
                isPasswordVisible={showPassword}
                onTogglePasswordVisibility={() =>
                  setShowPassword(!showPassword)
                }
                error={passwordError}
                showError={!!passwordError}
              />
            </Animated.View>
          )}

          <Animated.View style={{ transform: [{ scale: buttonScaleAnim }] }}>
            <Button
              text={isToggled ? "Sign in" : "Reset password"}
              onPress={isToggled ? handleSignIn : handleResetPassword}
            />
          </Animated.View>

          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={COLORS.PRIMARY_BLUE} />
              <Text style={styles.loadingText}>
                {isToggled ? "Signing in..." : "Sending reset email..."}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.footerView}>
          <Text style={styles.footerText}>
            New user?{" "}
            <Text onPress={handleCreateAccount} style={styles.footerLink}>
              Create an account
            </Text>
          </Text>
          <Text
            onPress={isToggled ? fadeOut : fadeIn}
            style={[styles.footerLink, styles.resetLink]}
          >
            {isToggled ? "Reset password" : "Back to login"}
          </Text>
          <Text style={styles.footerText}>Sign In with: </Text>
          <SocialIcon />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignIn;
