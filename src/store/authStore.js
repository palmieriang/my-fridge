import React, {
  createContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import {
  persistentLogin,
  getUserData,
  authSignIn,
  authSignOut,
  createUser,
  sendVerificationEmail,
  sendResetPassword,
  getProfileImageFromFirebase,
  deleteProfileImage,
  signInWithGoogle,
} from '../../api/api';

const initialState = {
  isLoading: true,
  isSignout: false,
  userToken: null,
  user: null,
  profileImg: null,
};

const reducer = (prevState, action) => {
  switch (action.type) {
    case 'RESTORE_TOKEN':
      return {
        ...prevState,
        isLoading: false,
        userToken: action.token,
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
        profileImg: null,
      };
    case 'PROFILE_IMG':
      return {
        ...prevState,
        profileImg: action.imgUrl,
      };
  }
};

const authStore = createContext(initialState);
const { Provider, Consumer } = authStore;

const AuthProvider = ({ children }) => {
  const [authState, dispatch] = useReducer(reducer, initialState);
  const [userData, setUserData] = useState({});

  // Persistent login credentials
  useEffect(() => {
    (async () => {
      let idToken;
      let user;
      let userData;
      try {
        ({ idToken, user } = await persistentLogin());
        userData = await getUserData(user.uid);
        authContext.getProfileImage(user.uid);
      } catch (error) {
        console.log('Restoring token failed', error);
      }
      setUserData(userData);
      dispatch({
        type: 'RESTORE_TOKEN',
        token: idToken,
        user,
      });
    })();
  }, []);

  const authContext = useMemo(
    () => ({
      signIn: async ({ email, password }) => {
        let idToken;
        let user;
        let userData;
        try {
          ({ idToken, user } = await authSignIn(email, password));
          userData = await getUserData(user.uid);
          authContext.getProfileImage(user.uid);
        } catch (error) {
          console.log('Sign in error', error.message);
        }
        setUserData(userData);
        dispatch({ type: 'SIGN_IN', token: idToken, user });
      },
      signInGoogle: async () => {
        const { idToken, user } = await signInWithGoogle();
        dispatch({ type: 'SIGN_IN', token: idToken, user });
      },
      signOut: () => {
        authSignOut()
          .then(() => {
            dispatch({ type: 'SIGN_OUT' });
          })
          .catch((error) => {
            console.log('Sign-out error: ', error.message);
          });
      },
      signUp: async ({ fullName, email, password, confirmPassword }) => {
        if (password !== confirmPassword) {
          alert("Passwords don't match.");
          return;
        }

        createUser(fullName, email, password)
          .then(() => {
            sendVerificationEmail();
          })
          .then(() => {
            alert('Please verify your account.');
          })
          .catch((error) => {
            alert(error.message);
            console.info('error ', JSON.stringify(error));
          });
      },
      resetPassword: (email) => {
        sendResetPassword(email)
          .then(() => {
            alert('Please check your account.');
          })
          .catch((error) => {
            alert(error.message);
            console.info('error ', JSON.stringify(error));
          });
      },
      getProfileImage: (id) => {
        getProfileImageFromFirebase(id)
          .then((url) => {
            dispatch({ type: 'PROFILE_IMG', imgUrl: url });
          })
          .catch((error) => {
            console.log('Profile img error: ', error.message);
          });
      },
      updateProfileImage: (url) => {
        dispatch({ type: 'PROFILE_IMG', imgUrl: url });
      },
      deleteImage: (id) => {
        deleteProfileImage(id)
          .then(() => {
            dispatch({ type: 'PROFILE_IMG', imgUrl: null });
          })
          .catch((error) => {
            console.log('Delete profile img error: ', error.message);
          });
      },
    }),
    []
  );

  return (
    <Provider value={{ authState, dispatch, authContext, userData }}>
      <Consumer>{children}</Consumer>
    </Provider>
  );
};

export { authStore, AuthProvider };
