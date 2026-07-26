import Button from "@components/Button/Button";
import FormInput from "@components/FormInput/FormInput";
import SocialIcon from "@components/SocialIcon/SocialIcon";
import FridgeIcon from "@components/svg/FridgeIcon";
import PadlockIcon from "@components/svg/PadlockIcon";
import UsernameIcon from "@components/svg/UsernameIcon";
import useToggle from "@components/utils/useToggle";
import { useFocusEffect } from "@react-navigation/native";
import { useState, useRef, useCallback, useEffect } from "react";
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
import Reanimated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  Easing,
} from "react-native-reanimated";
import { COLORS } from "src/constants/colors";

import styles from "./styles";
import { useAuth, useLocale } from "../../store";
import { validateEmail, validatePassword } from "../../utils/validation";

interface SignInProps {
  navigation: {
    navigate: (screen: string) => void;
  };
}

const SignIn = ({ navigation }: SignInProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isToggled, toggle] = useToggle(true);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { authContext } = useAuth();
  const { t } = useLocale();

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;

  // Header entrance animation
  const iconScale = useSharedValue(0.6);
  const iconOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(8);

  useEffect(() => {
    iconScale.value = withSpring(1, { damping: 14, stiffness: 120 });
    iconOpacity.value = withTiming(1, {
      duration: 500,
      easing: Easing.out(Easing.quad),
    });
    titleOpacity.value = withDelay(180, withTiming(1, { duration: 400 }));
    titleTranslateY.value = withDelay(
      180,
      withTiming(0, { duration: 400, easing: Easing.out(Easing.quad) }),
    );
  }, []);

  const iconAnimStyle = useAnimatedStyle(() => ({
    opacity: iconOpacity.value,
    transform: [{ scale: iconScale.value }],
  }));

  const titleAnimStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  useFocusEffect(
    useCallback(() => {
      setEmailError("");
      setPasswordError("");
    }, []),
  );

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

    try {
      await authContext.signIn({ email, password });
      // On success the auth state change in AppContainer triggers the fridge door animation
    } catch (error: any) {
      Alert.alert(
        t("signInFailed"),
        error?.message || t("signInFailedMessage"),
        [{ text: t("ok") }],
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!handleEmailValidation(email)) {
      return;
    }

    setIsLoading(true);
    try {
      await authContext.resetPassword(email);
      Alert.alert(t("passwordResetTitle"), t("passwordResetMessage"), [
        { text: t("ok"), onPress: fadeIn },
      ]);
    } catch (error: any) {
      Alert.alert(t("resetFailed"), error?.message || t("resetFailedMessage"), [
        { text: t("ok") },
      ]);
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
        <View style={styles.headerContainer}>
          <Reanimated.View style={[styles.iconBadge, iconAnimStyle]}>
            <FridgeIcon width={88} height={88} fill={COLORS.PRIMARY_BLUE} />
          </Reanimated.View>
          <Reanimated.Text style={[styles.appTitle, titleAnimStyle]}>
            My Fridge
          </Reanimated.Text>
        </View>

        <View style={styles.formContainer}>
          <FormInput
            labelValue={email}
            onChangeText={handleEmailChange}
            placeholderText={t("emailPlaceholder")}
            Icon={UsernameIcon}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
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
                placeholderText={t("passwordPlaceholder")}
                Icon={PadlockIcon}
                autoCapitalize="none"
                autoComplete="current-password"
                textContentType="password"
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
              text={isToggled ? t("signIn") : t("resetPassword")}
              onPress={isToggled ? handleSignIn : handleResetPassword}
            />
          </Animated.View>

          {isLoading && (
            <View
              style={styles.loadingContainer}
              accessibilityLiveRegion="polite"
            >
              <ActivityIndicator
                size="small"
                color={COLORS.PRIMARY_BLUE}
                accessibilityElementsHidden
              />
              <Text style={styles.loadingText}>
                {isToggled ? t("signingIn") : t("sendingResetEmail")}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.footerView}>
          <Text style={styles.footerText}>
            {t("newUser")}{" "}
            <Text
              onPress={handleCreateAccount}
              style={styles.footerLink}
              accessibilityRole="link"
            >
              {t("createAccount")}
            </Text>
          </Text>
          <Text
            onPress={isToggled ? fadeOut : fadeIn}
            style={[styles.footerLink, styles.resetLink]}
            accessibilityRole="link"
          >
            {isToggled ? t("resetPassword") : t("backToLogin")}
          </Text>
          <SocialIcon />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignIn;
