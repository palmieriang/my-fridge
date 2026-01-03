import { useEffect, useMemo, useReducer, useState, ReactNode } from "react";
import { Alert } from "react-native";

import { AuthStoreContext } from "./contexts";
import { AuthStateType, AuthContextMethods } from "./types";
import {
  persistentLogin,
  authSignIn,
  authSignOut,
  createUser,
  sendResetPassword,
  signInWithGoogle,
  deleteAccount,
} from "../../api/api";
import { ActionTypes } from "../constants";

const initialState: AuthStateType = {
  user: null,
  userToken: null,
  isLoading: true,
  profileImg: null,
};

const reducer = (state: AuthStateType, action: any) => {
  switch (action.type) {
    case ActionTypes.RESTORE_TOKEN:
    case ActionTypes.SIGN_IN:
      return {
        ...state,
        user: action.user,
        userToken: action.token,
        isLoading: false,
      };
    case ActionTypes.SIGN_OUT:
      return {
        ...state,
        user: null,
        userToken: null,
        isLoading: false,
        profileImg: null,
      };
    case ActionTypes.PROFILE_IMG:
      return {
        ...state,
        profileImg: action.imgUrl,
      };
    default:
      return state;
  }
};

const { Provider } = AuthStoreContext;

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, dispatch] = useReducer(reducer, initialState);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const unsubscribe = persistentLogin(dispatch, setUserData);
    return () => {
      unsubscribe();
    };
  }, []);

  const authContext: AuthContextMethods = useMemo(
    () => ({
      signIn: ({ email, password }) => {
        authSignIn(email, password);
      },
      signInGoogle: () => {
        signInWithGoogle(dispatch);
      },
      signOut: () => {
        authSignOut(dispatch);
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
        } catch (error: any) {
          console.error("Error in create user", error);
          Alert.alert(
            "Error creating account",
            error.message || "Please try again.",
            [
              {
                text: "Ok",
                onPress: () => null,
                style: "default",
              },
            ],
          );
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
        } catch (error: any) {
          console.error("Error in reset password", error);
          Alert.alert(
            "Error sending reset email",
            error.message || "Please try again.",
            [
              {
                text: "Ok",
                onPress: () => null,
                style: "default",
              },
            ],
          );
        }
      },
      updateProfileImage: (url) => {
        dispatch({ type: ActionTypes.PROFILE_IMG, imgUrl: url });
      },
      deleteImage: (id) => {
        // Profile images are now handled by Cloud Functions during account deletion
        dispatch({ type: ActionTypes.PROFILE_IMG, imgUrl: null });
      },
      deleteUser: () => {
        deleteAccount();
      },
    }),
    [dispatch],
  );

  return (
    <Provider value={{ authState, dispatch, authContext, userData }}>
      {children}
    </Provider>
  );
};

export { AuthStoreContext as authStore, AuthProvider };
