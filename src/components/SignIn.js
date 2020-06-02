import React, { useState, useContext } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableHighlight,
    View
} from 'react-native';
import { AuthContext } from '../authentication/authentication';
import LottieAnimation from '../animations/LottieAnimation';

const SignIn = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [playAnimation, setPlayAnimation] = useState(false);

    const { signIn } = useContext(AuthContext);

    const handleSignIn = () => {
        if(username.length > 3 && password.length > 3) {
            setPlayAnimation(true);
        }
    }

    const signInAfterAnimation = () => {
        signIn({ username, password })
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.animationContainer}>
                <LottieAnimation
                    animationEnd={signInAfterAnimation}
                    autoplay={false}
                    loop={false}
                    name="door"
                    play={playAnimation}
                />
            </View>
            <View style={styles.fieldContainer}>
                <TextInput
                    style={styles.text}
                    placeholder="Username (minimum 3 characters)"
                    value={username}
                    onChangeText={setUsername}
                />
                <TextInput
                    style={[styles.text, styles.borderTop]}
                    placeholder="Password (minimum 3 characters)"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
            </View>
            <TouchableHighlight
                onPress={handleSignIn}
                style={styles.button}
            >
                <Text style={styles.buttonText}>Sign in</Text>
            </TouchableHighlight>
        </View>
    );
};

const styles = StyleSheet.create({
    fieldContainer: {
        marginTop: 20,
        marginBottom: 20,
        backgroundColor: '#fff',
    },
    text: {
        height: 50,
        margin: 0,
        marginRight: 7,
        paddingLeft: 10,
    },
    button: {
        height: 50,
        backgroundColor: '#48BBEC',
        borderColor: '#48BBEC',
        alignSelf: 'stretch',
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
    borderTop: {
        borderColor: '#edeeef',
        borderTopWidth: 0.5,
    },
    animationContainer: {
        backgroundColor: '#fff',
        height: 450,
    },
});

export default SignIn;
