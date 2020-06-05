import React, { createContext, useEffect, useMemo, useReducer } from 'react';
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
        firebase.auth().onAuthStateChanged(user => {
            if (user?.uid) {
                console.info('user 1', user);
                dispatch({ type: 'RESTORE_TOKEN', token: user.uid });
            } else {
                console.log('Restoring token failed');
            }
        });
    }, []);

    const authContext = useMemo(
        () => ({
            signIn: async ({ email, password }) => {
            // In a production app, we need to send some data (usually username, password) to server and get a token
            // We will also need to handle errors if sign in failed
            // After getting token, we need to persist the token using `AsyncStorage`
            // In the example, we'll use a dummy token

                firebase.auth().signInWithEmailAndPassword(email, password)
                .then((response) => {
                    console.log(response.user);
                    dispatch({ type: 'SIGN_IN', token: response.user.uid });
                })
                .catch(function(error) {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    console.info('errorCode', errorCode);
                    console.info('errorMessage', errorMessage);
                });
            },
            signOut: () => {
                firebase.auth().signOut().then(function() {
                    console.log('Sign-out successful');
                    dispatch({ type: 'SIGN_OUT' });
                }).catch(function(error) {
                    console.log('Sign-out ', error);
                });
            },
            signUp: async ({ email, password, confirmPassword }) => {
            // In a production app, we need to send user data to server and get a token
            // We will also need to handle errors if sign up failed
            // After getting token, we need to persist the token using `AsyncStorage`
            // In the example, we'll use a dummy token

                if (password !== confirmPassword) {
                    alert("Passwords don't match.")
                    return
                }

                firebase.auth().createUserWithEmailAndPassword(email, password)
                .catch(function(error) {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    console.info('errorCode', errorCode);
                    console.info('errorMessage', errorMessage);
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
