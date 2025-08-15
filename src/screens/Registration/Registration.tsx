import Button from "@components/Button/Button";
import FormInput from "@components/FormInput/FormInput";
import EmailIcon from "@components/svg/EmailIcon";
import PadlockIcon from "@components/svg/PadlockIcon";
import UsernameIcon from "@components/svg/UsernameIcon";
import { useState, useContext } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
  ActivityIndicator,
  Alert,
} from "react-native";
import { COLORS } from "src/constants/colors";

import styles from "./styles";
import { authStore } from "../../store";
import {
  validateEmail,
  validatePasswordConfirmation,
  validateStrongPassword,
  validateFullName,
  getPasswordStrength,
} from "../../utils/validation";

interface RegistrationProps {
  navigation: {
    navigate: (screen: string) => void;
  };
}

const Registration = ({ navigation }: RegistrationProps) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullNameError, setFullNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(
    getPasswordStrength("", {
      weak: COLORS.ERROR,
      fair: "#ff9800",
      good: "#2196f3",
      strong: "#4caf50",
      default: COLORS.DARK_GRAY,
    }),
  );
  const [acceptTerms, setAcceptTerms] = useState(false);

  const { authContext } = useContext(authStore);

  const handleFullNameValidation = (name: string) => {
    const result = validateFullName(name);
    setFullNameError(result.error);
    return result.isValid;
  };

  const handleEmailValidation = (email: string) => {
    const result = validateEmail(email);
    setEmailError(result.error);
    return result.isValid;
  };

  const handlePasswordValidation = (password: string) => {
    const result = validateStrongPassword(password);
    setPasswordError(result.error);
    return result.isValid;
  };

  const handleConfirmPasswordValidation = (confirmPassword: string) => {
    const result = validatePasswordConfirmation(password, confirmPassword);
    setConfirmPasswordError(result.error);
    return result.isValid;
  };

  const handleFullNameChange = (text: string) => {
    setFullName(text);
    if (fullNameError) setFullNameError("");
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError) setEmailError("");
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    setPasswordStrength(
      getPasswordStrength(text, {
        weak: COLORS.ERROR,
        fair: "#ff9800",
        good: "#2196f3",
        strong: "#4caf50",
        default: COLORS.DARK_GRAY,
      }),
    );
    if (passwordError) setPasswordError("");
    if (confirmPassword && confirmPasswordError) {
      const result = validatePasswordConfirmation(text, confirmPassword);
      setConfirmPasswordError(result.error);
    }
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    if (confirmPasswordError) setConfirmPasswordError("");
  };

  const handleRegistration = async () => {
    const isFullNameValid = handleFullNameValidation(fullName);
    const isEmailValid = handleEmailValidation(email);
    const isPasswordValid = handlePasswordValidation(password);
    const isConfirmPasswordValid =
      handleConfirmPasswordValidation(confirmPassword);

    if (
      !isFullNameValid ||
      !isEmailValid ||
      !isPasswordValid ||
      !isConfirmPasswordValid
    ) {
      return;
    }

    if (!acceptTerms) {
      Alert.alert(
        "Terms Required",
        "Please accept the Terms and Conditions to create an account.",
        [{ text: "OK" }],
      );
      return;
    }

    setIsLoading(true);

    try {
      await authContext.signUp({
        fullName: fullName.trim(),
        email,
        password,
        confirmPassword,
      });
      navigation.navigate("signin");
    } catch (error: any) {
      console.error("Registration error:", error);
      Alert.alert(
        "Registration Failed",
        error?.message || "Unable to create account. Please try again.",
        [{ text: "OK" }],
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToLogin = () => {
    navigation.navigate("signin");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 24 }} // move to style?
        keyboardShouldPersistTaps="handled"
      >
        <FormInput
          labelValue={fullName}
          onChangeText={handleFullNameChange}
          placeholderText="Full Name"
          Icon={UsernameIcon}
          autoCapitalize="words"
          underlineColorAndroid="transparent"
          error={fullNameError}
          showError={!!fullNameError}
        />
        <FormInput
          labelValue={email}
          onChangeText={handleEmailChange}
          placeholderText="Email"
          Icon={EmailIcon}
          keyboardType="email-address"
          autoCapitalize="none"
          underlineColorAndroid="transparent"
          error={emailError}
          showError={!!emailError}
        />
        <FormInput
          labelValue={password}
          onChangeText={handlePasswordChange}
          placeholderText="Password"
          Icon={PadlockIcon}
          autoCapitalize="none"
          underlineColorAndroid="transparent"
          secureTextEntry
          error={passwordError}
          showError={!!passwordError}
        />

        {password.length > 0 && (
          <View style={styles.passwordStrengthContainer}>
            <View style={styles.strengthBarContainer}>
              {[1, 2, 3, 4].map((level) => (
                <View
                  key={level}
                  style={[
                    styles.strengthBar,
                    {
                      backgroundColor:
                        level <= passwordStrength.strength
                          ? passwordStrength.color
                          : COLORS.LIGHT_GRAY,
                    },
                  ]}
                />
              ))}
            </View>
            <Text
              style={[styles.strengthText, { color: passwordStrength.color }]}
            >
              {passwordStrength.text}
            </Text>
          </View>
        )}

        <FormInput
          labelValue={confirmPassword}
          onChangeText={handleConfirmPasswordChange}
          placeholderText="Confirm password"
          Icon={PadlockIcon}
          autoCapitalize="none"
          underlineColorAndroid="transparent"
          secureTextEntry
          error={confirmPasswordError}
          showError={!!confirmPasswordError}
        />

        <View style={styles.termsContainer}>
          <Text
            style={[styles.checkbox, acceptTerms && styles.checkboxChecked]}
            onPress={() => setAcceptTerms(!acceptTerms)}
          >
            {acceptTerms ? "✓" : ""}
          </Text>
          <Text style={styles.termsText}>
            I accept the{" "}
            <Text style={styles.termsLink}>Terms and Conditions</Text> and{" "}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </View>

        <Button text="Create account" onPress={handleRegistration} />

        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={COLORS.PRIMARY_BLUE} />
            <Text style={styles.loadingText}>Creating account...</Text>
          </View>
        )}

        <View style={styles.footerView}>
          <Text style={styles.footerText}>
            Already got an account?{" "}
            <Text onPress={handleGoToLogin} style={styles.footerLink}>
              Log in
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Registration;
