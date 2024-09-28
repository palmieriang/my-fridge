import { FontAwesome } from "@expo/vector-icons";
import React, { useContext } from "react";
import { View } from "react-native";

import styles from "./styles";
import { authStore } from "../../store";

const SocialIcon = () => {
  const { authContext } = useContext(authStore);

  const signInGoogle = () => {
    authContext.signInGoogle();
  };

  return (
    <View style={styles.iconsContainer}>
      <FontAwesome.Button
        borderRadius={50}
        color="#fff"
        name="google"
        backgroundColor="#ea4335"
        onPress={signInGoogle}
        size={26}
        iconStyle={styles.icons}
      />
    </View>
  );
};

export default SocialIcon;
