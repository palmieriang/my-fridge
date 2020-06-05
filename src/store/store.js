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
        // const usersRef = firebase.firestore().collection('users');
        // firebase.auth().onAuthStateChanged(user => {
        //     if (user) {
        //         console.info('user', user);
        //         dispatch({ type: 'RESTORE_TOKEN', token: user.uid });

        //         usersRef
        //         .doc(user.uid)
        //         .get()
        //         .then((document) => {
        //             const userData = document.data()
        //             console.info('userData', userData);
        //             dispatch({ type: 'RESTORE_TOKEN', token: userData });
        //         })
        //         .catch((error) => {
        //             setLoading(false)
        //         });
        //     } else {
        //         console.log('Restoring token failed');
        //     }
        // });
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
                    const uid = response.user.uid;
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
                            dispatch({ type: 'SIGN_IN', token: email });
                            navigation.navigate('list', {user})
                        })
                        .catch(error => {
                            alert(error);
                            console.log('2', error);
                        });
                })
                .catch(error => {
                    alert(error);
                    console.log('1', error);
                })
            },
            signOut: () => {
                firebase.auth().signOut().then(function() {
                    console.log('Sign-out successful ');
                    dispatch({ type: 'SIGN_OUT' });
                }).catch(function(error) {
                    console.log('Sign-out error ', error);
                });
            },
            signUp: async ({ fullName, email, password, confirmPassword }) => {
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
                    .createUserWithEmailAndPassword(email, password)
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
                                alert(error);
                                console.log('2 registration ', error);
                            });
                    })
                    .catch((error) => {
                        alert(error);
                        console.log('1 registration ', error);
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
