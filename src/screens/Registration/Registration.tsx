import Button from "@components/Button/Button";
import FormInput from "@components/FormInput/FormInput";
import PasswordStrengthIndicator from "@components/PasswordStrengthIndicator/PasswordStrengthIndicator";
import EmailIcon from "@components/svg/EmailIcon";
import PadlockIcon from "@components/svg/PadlockIcon";
import UsernameIcon from "@components/svg/UsernameIcon";
import { useState } from "react";
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
import { useAuth, useLocale } from "../../store";
import {
  validateEmail,
  validatePasswordConfirmation,
  validateStrongPassword,
  validateFullName,
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
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { authContext } = useAuth();
  const { t } = useLocale();

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
        t("attention"),
        t("termsRequiredMessage"),
        [{ text: t("ok") }],
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
        t("registrationFailed"),
        error?.message || t("registrationFailedMessage"),
        [{ text: t("ok") }],
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
          placeholderText={t("fullNamePlaceholder")}
          Icon={UsernameIcon}
          autoCapitalize="words"
          underlineColorAndroid="transparent"
          error={fullNameError}
          showError={!!fullNameError}
        />
        <FormInput
          labelValue={email}
          onChangeText={handleEmailChange}
          placeholderText={t("emailPlaceholder")}
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
          placeholderText={t("passwordPlaceholder")}
          Icon={PadlockIcon}
          autoCapitalize="none"
          underlineColorAndroid="transparent"
          secureTextEntry={!showPassword}
          showPasswordToggle
          isPasswordVisible={showPassword}
          onTogglePasswordVisibility={() => setShowPassword(!showPassword)}
          error={passwordError}
          showError={!!passwordError}
        />

        <PasswordStrengthIndicator password={password} />

        <FormInput
          labelValue={confirmPassword}
          onChangeText={handleConfirmPasswordChange}
          placeholderText={t("confirmPasswordPlaceholder")}
          Icon={PadlockIcon}
          autoCapitalize="none"
          underlineColorAndroid="transparent"
          secureTextEntry={!showConfirmPassword}
          showPasswordToggle
          isPasswordVisible={showConfirmPassword}
          onTogglePasswordVisibility={() =>
            setShowConfirmPassword(!showConfirmPassword)
          }
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
            {t("termsText")}
          </Text>
        </View>

        <Button text={t("createAccount")} onPress={handleRegistration} />

        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={COLORS.PRIMARY_BLUE} />
            <Text style={styles.loadingText}>{t("creatingAccount")}</Text>
          </View>
        )}

        <View style={styles.footerView}>
          <Text style={styles.footerText}>
            {t("alreadyHaveAccount")}{" "}
            <Text onPress={handleGoToLogin} style={styles.footerLink}>
              {t("signIn")}
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Registration;
