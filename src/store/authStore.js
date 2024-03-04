import React, {
  createContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import { Alert } from "react-native";

import {
  persistentLogin,
  authSignIn,
  authSignOut,
  createUser,
  sendVerificationEmail,
  sendResetPassword,
  deleteProfileImage,
  signInWithGoogle,
  deleteAccount,
} from "../../api/api";
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
          Alert.alert("Passwords don't match", "Please try again.", [
            {
              text: "Ok",
              onPress: () => null,
              style: "default",
            },
          ]);

          return;
        }

        try {
          await createUser(fullName, email, password);
          await sendVerificationEmail();
          Alert.alert(
            "Account created",
            "Please check your email and verify your account.",
            [
              {
                text: "Ok",
                onPress: () => null,
                style: "default",
              },
            ],
          );
        } catch (error) {
          console.error("Error in create user", error);
        }
      },
      resetPassword: async (email) => {
        try {
          await sendResetPassword(email);
          Alert.alert(
            "Reset password",
            "Please check your email and follow the instructions.",
            [
              {
                text: "Ok",
                onPress: () => null,
                style: "default",
              },
            ],
          );
        } catch (error) {
          console.error("Error in reset password", error);
        }
      },
      updateProfileImage: (url) => {
        dispatch({ type: ActionTypes.PROFILE_IMG, imgUrl: url });
      },
      deleteImage: (id) => {
        deleteProfileImage(id, dispatch);
      },
      deleteUser: () => {
        deleteAccount();
      },
    }),
    [],
  );

  return (
    <Provider value={{ authState, dispatch, authContext, userData }}>
      <Consumer>{children}</Consumer>
    </Provider>
  );
};

export { authStore, AuthProvider };
