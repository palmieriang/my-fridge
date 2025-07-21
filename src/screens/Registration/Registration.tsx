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
} from "react-native";

import styles from "./styles";
import { authStore } from "../../store";

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

  const { authContext } = useContext(authStore);

  const handleRegistration = () => {
    authContext
      .signUp({ fullName, email, password, confirmPassword })
      .then(() => navigation.navigate("signin"));
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
          placeholderText="Confirm password"
          Icon={PadlockIcon}
          autoCapitalize="none"
          underlineColorAndroid="transparent"
          secureTextEntry
        />
        <Button text="Create account" onPress={handleRegistration} />
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
