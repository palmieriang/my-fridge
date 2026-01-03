import {
  View,
  TouchableOpacity,
  Text,
  StyleProp,
  ViewStyle,
} from "react-native";

import styles from "./styles";
import { useAuth } from "../../store";

type StylesType = {
  iconsContainer: StyleProp<ViewStyle>;
  googleButton: StyleProp<ViewStyle>;
  googleButtonText: StyleProp<ViewStyle>;
  googleIcon: StyleProp<ViewStyle>;
  googleButtonContent: StyleProp<ViewStyle>;
};

const SocialIcon = () => {
  const { authContext } = useAuth();

  const signInGoogle = () => {
    authContext.signInGoogle();
  };

  return (
    <View style={(styles as StylesType).iconsContainer}>
      <TouchableOpacity
        style={(styles as StylesType).googleButton}
        onPress={signInGoogle}
        activeOpacity={0.8}
      >
        <View style={(styles as StylesType).googleButtonContent}>
          <View style={(styles as StylesType).googleIcon}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: "#4285f4",
              }}
            >
              G
            </Text>
          </View>
          <Text style={(styles as StylesType).googleButtonText}>
            Sign in with Google
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default SocialIcon;
