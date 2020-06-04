import React, { createContext, useEffect, useMemo, useReducer } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { firebase } from '../firebase/config';
import {decode, encode} from 'base-64';
if (!global.btoa) { global.btoa = encode };
if (!global.atob) { global.atob = decode };

const initialState = {
    isLoading: true,
    isSignout: false,
    userToken: null,
};

const reducer = (prevState, action) => {
    switch (action.type) {
        case 'RESTORE_TOKEN':
        return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
        };
        case 'SIGN_IN':
        return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
        };
        case 'SIGN_OUT':
        return {
            ...prevState,
            isSignout: true,
            userToken: null,
        }
    };
}

const store = createContext(initialState);
const { Provider, Consumer } = store;

const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        // Fetch the token from storage then navigate to our appropriate place
        const bootstrapAsync = async () => {
            let userToken;

            try {
                userToken = await AsyncStorage.getItem('userToken');
            } catch (error) {
                console.log('Restoring token failed ', error);
            }

            // After restoring token, we may need to validate it in production apps

            // This will switch to the App screen or Auth screen and this loading
            // screen will be unmounted and thrown away.
            dispatch({ type: 'RESTORE_TOKEN', token: userToken });
        };

        bootstrapAsync();
    }, []);

    const authContext = useMemo(
        () => ({
            signIn: async ({ email, password }) => {
            // In a production app, we need to send some data (usually username, password) to server and get a token
            // We will also need to handle errors if sign in failed
            // After getting token, we need to persist the token using `AsyncStorage`
            // In the example, we'll use a dummy token

                firebase
                .auth()
                .signInWithEmailAndPassword(email, password)
                .then((response) => {
                    console.log(response.user.id);
                    const uid = response.user.uid
                    const usersRef = firebase.firestore().collection('users')
                    usersRef
                        .doc(uid)
                        .get()
                        .then(firestoreDocument => {
                            if (!firestoreDocument.exists) {
                                alert("User does not exist anymore.")
                                return;
                            }
                            const user = firestoreDocument.data()
                            navigation.navigate('list', {user})
                        })
                        .catch(error => {
                            alert(error)
                            console.log('2')
                        });
                })
                .catch(error => {
                    alert(error)
                    console.log('1')
                })

                dispatch({ type: 'SIGN_IN', token: email });
            },
            signOut: () => dispatch({ type: 'SIGN_OUT' }),
            signUp: async data => {
            // In a production app, we need to send user data to server and get a token
            // We will also need to handle errors if sign up failed
            // After getting token, we need to persist the token using `AsyncStorage`
            // In the example, we'll use a dummy token

                if (password !== confirmPassword) {
                    alert("Passwords don't match.")
                    return
                }
                firebase
                    .auth()
                    .createUserWithEmailAndPassword(email, password, fullName)
                    .then((response) => {
                        const uid = response.user.uid
                        const data = {
                            id: uid,
                            email,
                            fullName,
                        };
                        const usersRef = firebase.firestore().collection('users')
                        usersRef
                            .doc(uid)
                            .set(data)
                            .then(() => {
                                navigation.navigate('signin', {user: data})
                            })
                            .catch((error) => {
                                alert(error)
                            });
                    })
                    .catch((error) => {
                        alert(error)
                });
            },
        }), []
    );

    return (
        <Provider value={{ state, dispatch, authContext }}>
            <Consumer>
                {children}
            </Consumer>
        </Provider>
    );
};

export { store, AuthProvider };
