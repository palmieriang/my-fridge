import React, { useContext } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { authStore } from '../store/authStore';

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

const styles = StyleSheet.create({
  iconsContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 50,
  },
  icons: {
    margin: 10,
  },
});

export default SocialIcon;
