import React, { useState, useContext } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableHighlight,
    View
} from 'react-native';
import { AuthContext } from '../authentication/authentication';

const SignIn = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const { signIn } = useContext(AuthContext);

    return (
        <View style={{ flex: 1 }}>
            <Text style={styles.text}>SignIn</Text>
            <View style={styles.fieldContainer}>
                <TextInput
                    style={styles.text}
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                />
                <TextInput
                    style={[styles.text, styles.borderTop]}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
            </View>
            <TouchableHighlight
                onPress={() => signIn({ username, password })}
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
});

export default SignIn;
