import React, {
  createContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import {
  persistentLogin,
  authSignIn,
  authSignOut,
  createUser,
  sendVerificationEmail,
  sendResetPassword,
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
    const unsubscribe = persistentLogin(dispatch, setUserData);
    return () => {
      unsubscribe();
    };
  }, []);

  const authContext = useMemo(
    () => ({
      signIn: ({ email, password }) => {
        authSignIn(email, password);
      },
      signInGoogle: () => {
        signInWithGoogle();
      },
      signOut: () => {
        authSignOut();
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
            console.log('Error in create user', error);
          });
      },
      resetPassword: (email) => {
        sendResetPassword(email)
          .then(() => {
            alert('Please check your account.');
          })
          .catch((error) => {
            console.log('Error in reset password', error);
          });
      },
      updateProfileImage: (url) => {
        dispatch({ type: 'PROFILE_IMG', imgUrl: url });
      },
      deleteImage: (id) => {
        deleteProfileImage(id, dispatch);
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
