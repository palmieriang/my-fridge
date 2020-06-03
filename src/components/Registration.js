import React, { useState, useContext } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableHighlight,
    View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { store } from '../store/store';

const Registration = ({ navigation }) => {
    const [fullName, setFullName] = useState('')
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('')

    const { authContext } = useContext(store);

    const handleRegistration = () => {
        console.info('Registered');
    };

    const handleGoToLogin = () => {
        navigation.navigate('Login')
    }

    return (
        <View style={{ flex: 1 }}>
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always"
            >
                <View style={styles.fieldContainer}>
                    <TextInput
                        style={styles.text}
                        placeholder="Full name"
                        value={fullName}
                        onChangeText={setFullName}
                    />
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
                    <TextInput
                        style={[styles.text, styles.borderTop]}
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                    />
                </View>
                <TouchableHighlight
                    onPress={handleRegistration}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Create account</Text>
                </TouchableHighlight>
                <View>
                    <Text>Already got an account? <Text onPress={handleGoToLogin}>Log in</Text></Text>
                </View>
            </KeyboardAwareScrollView>
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

export default Registration;
