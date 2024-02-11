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
import { ActionTypes } from "../constants";

const initialState = {
  isLoading: true,
  isSignout: false,
  userToken: null,
  user: null,
  profileImg: null,
};

const reducer = (prevState, action) => {
  switch (action.type) {
    case ActionTypes.RESTORE_TOKEN:
    case ActionTypes.SIGN_IN:
      return {
        ...prevState,
        isLoading: false,
        isSignout: false,
        userToken: action.token,
        user: action.user,
      };
    case ActionTypes.SIGN_OUT:
      return {
        ...prevState,
        isSignout: true,
        userToken: null,
        user: null,
        profileImg: null,
      };
    case ActionTypes.PROFILE_IMG:
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

        try {
          await createUser(fullName, email, password);
          await sendVerificationEmail();
          alert('Please verify your account.');
        } catch (error) {
          console.error('Error in create user', error);
        }
      },
      resetPassword: async (email) => {
        try {
          await sendResetPassword(email);
          alert('Please check your account.');
        } catch (error) {
          console.error('Error in reset password', error);
        }
      },
      updateProfileImage: (url) => {
        dispatch({ type: ActionTypes.PROFILE_IMG, imgUrl: url });
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
