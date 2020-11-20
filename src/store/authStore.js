import React,
{ createContext,
    useEffect,
    useMemo,
    useReducer,
    useState
} from 'react';
import { firebase } from '../firebase/config';
import { persistentLogin, getUserData } from '../../api/api';

const initialState = {
    isLoading: true,
    isSignout: false,
    userToken: null,
    user: null,
};

const reducer = (prevState, action) => {
    switch (action.type) {
        case 'RESTORE_TOKEN':
        return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
            user: action.user,
        };
        case 'SIGN_IN':
        return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
            user: action.user,
        };
        case 'SIGN_OUT':
        return {
            ...prevState,
            isSignout: true,
            userToken: null,
            user: null,
        }
    };
}

const authStore = createContext(initialState);
const { Provider, Consumer } = authStore;
const db = firebase.firestore();

const AuthProvider = ({ children }) => {
    const [authState, dispatch] = useReducer(reducer, initialState);
    const [userData, setUserData] = useState({});

    // Persistent login credentials
    useEffect(() => {
        persistentLogin()
            .then(({ idToken, user }) => {
                getUserData(user.uid)
                    .then(userData => {
                        setUserData(userData);
                    })
                    .catch(error => console.log('Error: ', error));

                setTimeout(() => {
                    dispatch({ type: 'RESTORE_TOKEN', token: idToken, user });
                }, 500);
            })
            .catch((error) => {
                console.log('Restoring token failed', error);
            });
    }, []);

    const authContext = useMemo(
        () => ({
            signIn: async ({ email, password }) => {
                firebase.auth().signInWithEmailAndPassword(email, password)
                .then((response) => {
                    response.user.getIdToken(true).then((idToken) => {
                        dispatch({ type: 'SIGN_IN', token: idToken, user: response.user });
                    }).catch((error) => {
                        console.log('Current user error', error);
                    });
                })
                .catch(function(error) {
                    alert(error.message);
                    console.info('Sign in error: ', error.message);
                });
            },
            signOut: () => {
                firebase.auth().signOut().then(function() {
                    console.log('Sign-out successful');
                    dispatch({ type: 'SIGN_OUT' });
                }).catch(function(error) {
                    console.log('Sign-out error: ', error.message);
                });
            },
            signUp: async ({ fullName, email, password, confirmPassword }) => {
                if (password !== confirmPassword) {
                    alert("Passwords don't match.")
                    return
                }

                firebase.auth().createUserWithEmailAndPassword(email, password)
                .then((response) => {
                    const uid = response.user.uid
                    const data = {
                        id: uid,
                        email,
                        fullName,
                        locale: 'en',
                        theme: 'lightRed',
                    };
                    // add more user data inside firestore
                    return db.collection('users')
                        .doc(uid)
                        .set(data)
                        .catch((error) => {
                            alert(error);
                            console.log('set data error: ', error);
                        });
                })
                .then(() => {
                    // send verification email
                    const user = firebase.auth().currentUser;
                    user.sendEmailVerification()
                        .then(() => {
                            alert('Please verify your account.');
                            console.log('Verification email sent.');
                        }).catch((error) => {
                            console.log('Verification email not sent.', error);
                        });
                })
                .catch((error) => {
                    alert(error);
                    console.info('error ', JSON.stringify(error));
                });
            },
        }), []
    );

    return (
        <Provider value={{ authState, dispatch, authContext, userData }}>
            <Consumer>
                {children}
            </Consumer>
        </Provider>
    );
};

export { authStore, AuthProvider };
