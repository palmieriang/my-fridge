import { getApp } from "@react-native-firebase/app";
import { getAuth, connectAuthEmulator } from "@react-native-firebase/auth";
import {
  getFirestore,
  connectFirestoreEmulator,
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
let profileImagesRef = null;

export const initializeFirebaseServices = async () => {
  console.log("[Firebase] Initializing Firebase services...");

  try {
    // Get the default Firebase App instance using the modular getApp()
    const appInstance = getApp();
    console.log("[Firebase] Got default app instance:", appInstance.name);

    // Initialize service instances using the modular API, passing the app instance
    _authInstance = getAuth(appInstance);
    console.log("[Firebase] Auth initialized:", _authInstance.app.name);

    _firestoreInstance = getFirestore(appInstance);
    console.log(
      "[Firebase] Firestore initialized:",
      _firestoreInstance.app.name,
    );

    _storageInstance = getStorage(appInstance);
    console.log("[Firebase] Storage initialized:", _storageInstance.app.name);

    // Setup Firestore refs
    usersRef = _firestoreInstance.collection("users");
    productsRef = _firestoreInstance.collection("products");
    console.log("[Firebase] Firestore collections set: users, products");

    // Storage ref for profile images
    profileImagesRef = _storageInstance.ref("profileImages");
    console.log("[Firebase] Storage ref set: profileImages");

    if (__DEV__) {
      const debuggerHost = Platform.OS === "android" ? "10.0.2.2" : "localhost";

      console.log(`[Firebase] Connecting to emulators at ${debuggerHost}`);

      connectAuthEmulator(_authInstance, `http://${debuggerHost}:9099`);
      connectFirestoreEmulator(_firestoreInstance, debuggerHost, 8080);
      connectStorageEmulator(_storageInstance, debuggerHost, 9199);

      console.log("[Firebase] Emulators connected");
    }

    // Listen to auth state changes for debugging
    _authInstance.onAuthStateChanged((user) => {
      if (user) {
        console.log(`[Firebase] User logged in: ${user.uid}`);
      } else {
        console.log("[Firebase] User logged out");
      }
    });

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

// Export functions to get the initialized service instances
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
    // Fallback: If not initialized, try to get it, but this might lead to issues if app is not initialized
    return getFirestore(getApp()).collection("users");
  }
  return usersRef;
};

export const getProductsRef = () => {
  if (!productsRef) {
    console.error(
      "Firebase 'products' collection reference not initialized. Ensure initializeFirebaseServices() has been called.",
    );
    return getFirestore(getApp()).collection("products");
  }
  return productsRef;
};
