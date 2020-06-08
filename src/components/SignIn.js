import React, { useState, useContext } from 'react';
import {
    Button,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LottieAnimation from '../animations/LottieAnimation';

import { authStore } from '../store/authStore';

const SignIn = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [playAnimation, setPlayAnimation] = useState(false);

    const { authContext } = useContext(authStore);

    const handleSignIn = () => {
        if(email.length > 3 && password.length > 3) {
            setPlayAnimation(true);
        }
    }

    const signInAfterAnimation = () => {
        authContext.signIn({ email, password });
    }

    const handleCreateAccount = () => {
        navigation.navigate('registration');
    }

    return (
        <View style={{ flex: 1 }}>
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always"
            >
                <View style={styles.animationContainer}>
                    <LottieAnimation
                        animationEnd={signInAfterAnimation}
                        autoplay={false}
                        loop={false}
                        name="door"
                        play={playAnimation}
                    />
                </View>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#aaaaaa"
                    value={email}
                    onChangeText={setEmail}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#aaaaaa"
                    value={password}
                    onChangeText={setPassword}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    secureTextEntry
                />
                <TouchableOpacity
                    onPress={handleSignIn}
                    style={styles.button}
                >
                    <Text style={styles.buttonTitle}>Sign in</Text>
                </TouchableOpacity>

                <View style={styles.footerView}>
                    <Text style={styles.footerText}>New user? <Text onPress={handleCreateAccount} style={styles.footerLink}>Create an account</Text></Text>
                </View>
            </KeyboardAwareScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    input: {
        backgroundColor: 'white',
        borderRadius: 5,
        height: 48,
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 30,
        marginRight: 30,
        overflow: 'hidden',
        paddingLeft: 16,
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#48BBEC',
        borderRadius: 5,
        justifyContent: 'center',
        height: 48,
        marginLeft: 30,
        marginRight: 30,
        marginTop: 20,
    },
    buttonTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    animationContainer: {
        backgroundColor: '#fff',
        height: 450,
    },
    footerView: {
        alignItems: 'center',
        flex: 1,
        marginTop: 20
    },
    footerText: {
        color: '#2e2e2d',
        fontSize: 16,
    },
    footerLink: {
        color: '#48BBEC',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default SignIn;
