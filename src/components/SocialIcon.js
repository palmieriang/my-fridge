import React, { useContext } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { authStore } from '../store/authStore';

const SocialIcon = () => {
  const { authContext } = useContext(authStore);

  const signInGoogle = () => {
    authContext.signInGoogle();
  };

  const signInFacebook = () => {
    authContext.signInFacebook();
  };

  return (
    <View style={styles.iconsContainer}>
      <FontAwesome.Button
        borderRadius={2}
        color="#fff"
        name="facebook"
        backgroundColor="#3b5998"
        onPress={signInFacebook}
        size={26}
        iconStyle={styles.icons}
      ></FontAwesome.Button>
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
    width: '34%',
    marginTop: 20,
    marginBottom: 50,
  },
  icons: {
    margin: 10,
  },
});

export default SocialIcon;
