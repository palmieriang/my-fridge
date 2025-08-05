import { FontAwesome } from "@expo/vector-icons";
import { useContext } from "react";
import { View, StyleProp, ViewStyle } from "react-native";
import { COLORS } from "src/constants/colors";

import styles from "./styles";
import { authStore } from "../../store";

type StylesType = {
  iconsContainer: StyleProp<ViewStyle>;
  icons: StyleProp<ViewStyle>;
};

const SocialIcon = () => {
  const { authContext } = useContext(authStore);

  const signInGoogle = () => {
    authContext.signInGoogle();
  };

  return (
    <View style={(styles as StylesType).iconsContainer}>
      <FontAwesome.Button
        borderRadius={50}
        color={COLORS.WHITE}
        name="google"
        backgroundColor={COLORS.GOOGLE_RED}
        onPress={signInGoogle}
        size={26}
        iconStyle={styles.icons}
      />
    </View>
  );
};

export default SocialIcon;
