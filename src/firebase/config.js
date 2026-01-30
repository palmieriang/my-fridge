import { getApp } from "@react-native-firebase/app";
import {
  getAuth,
  connectAuthEmulator,
  onAuthStateChanged,
} from "@react-native-firebase/auth";
import {
  getFirestore,
  connectFirestoreEmulator,
  collection,
} from "@react-native-firebase/firestore";
import {
  getStorage,
  connectStorageEmulator,
} from "@react-native-firebase/storage";
import { Platform } from "react-native";

let _authInstance = null;
let _firestoreInstance = null;
let _storageInstance = null;

let usersRef = null;
let productsRef = null;

export const initializeFirebaseServices = async () => {
  try {
    const appInstance = getApp();

    _authInstance = getAuth(appInstance);
    console.log("[Firebase] Auth initialized");

    _firestoreInstance = getFirestore(appInstance);
    console.log("[Firebase] Firestore initialized");

    _storageInstance = getStorage(appInstance);
    console.log("[Firebase] Storage initialized");

    usersRef = collection(_firestoreInstance, "users");
    productsRef = collection(_firestoreInstance, "products");
    console.log("[Firebase] Firestore collections set");

    if (__DEV__) {
      const debuggerHost = Platform.OS === "android" ? "10.0.2.2" : "localhost";

      connectAuthEmulator(_authInstance, `http://${debuggerHost}:9099`);
      connectFirestoreEmulator(_firestoreInstance, debuggerHost, 8080);
      connectStorageEmulator(_storageInstance, debuggerHost, 9199);

      console.log("[Firebase] Emulators connected");
    }

    return {
      authInstance: _authInstance,
      firestoreInstance: _firestoreInstance,
      storageInstance: _storageInstance,
    };
  } catch (error) {
    console.error("[Firebase] Initialization error:", error);
    throw error;
  }
};

export const getAuthService = () => {
  if (!_authInstance) {
    console.error(
      "Firebase Auth service not initialized. Ensure initializeFirebaseServices() has been called.",
    );
    return getAuth(getApp());
  }
  return _authInstance;
};

export const getDbService = () => {
  if (!_firestoreInstance) {
    console.error(
      "Firebase Firestore service not initialized. Ensure initializeFirebaseServices() has been called.",
    );
    return getFirestore(getApp());
  }
  return _firestoreInstance;
};

export const getUsersRef = () => {
  if (!usersRef) {
    console.error(
      "Firebase 'users' collection reference not initialized. Ensure initializeFirebaseServices() has been called.",
    );
    return collection(getFirestore(getApp()), "users");
  }
  return usersRef;
};

export const getProductsRef = () => {
  if (!productsRef) {
    console.error(
      "Firebase 'products' collection reference not initialized. Ensure initializeFirebaseServices() has been called.",
    );
    return collection(getFirestore(getApp()), "products");
  }
  return productsRef;
};

export const getStorageService = () => {
  if (!_storageInstance) {
    console.error(
      "Firebase Storage service not initialized. Ensure initializeFirebaseServices() has been called.",
    );
    return getStorage(getApp());
  }
  return _storageInstance;
};
