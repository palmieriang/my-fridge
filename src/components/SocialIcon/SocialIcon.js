import React, { useContext } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { View } from 'react-native';
import { authStore } from '../../store';
import styles from './styles';

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
      ></FontAwesome.Button>
    </View>
  );
};

export default SocialIcon;
