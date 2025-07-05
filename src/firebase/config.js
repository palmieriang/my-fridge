import firebase from "@react-native-firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "@react-native-firebase/auth";
import { getFirestore } from "@react-native-firebase/firestore";
import { getStorage } from "@react-native-firebase/storage";
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
    // Get the default Firebase App instance, which is now initialized natively
    const appInstance = firebase.app();
    console.log("[Firebase] Got default app instance:", appInstance.name);

    // Initialize service instances using the modular API, passing the app instance
    _authInstance = getAuth(appInstance); // <-- Use getAuth(appInstance)
    console.log("[Firebase] Auth initialized:", _authInstance.app.name);

    _firestoreInstance = getFirestore(appInstance); // <-- Use getFirestore(appInstance)
    console.log(
      "[Firebase] Firestore initialized:",
      _firestoreInstance.app.name,
    );

    _storageInstance = getStorage(appInstance); // <-- Use getStorage(appInstance)
    console.log("[Firebase] Storage initialized:", _storageInstance.app.name);

    // Setup Firestore refs
    // Ensure you use the instance for collection/ref calls
    usersRef = _firestoreInstance.collection("users"); // Corrected to use _firestoreInstance
    productsRef = _firestoreInstance.collection("products"); // Corrected to use _firestoreInstance
    console.log("[Firebase] Firestore collections set: users, products");

    // Storage ref for profile images
    profileImagesRef = _storageInstance.ref("profileImages"); // Corrected to use _storageInstance
    console.log("[Firebase] Storage ref set: profileImages");

    if (false) {
      const debuggerHost = Platform.OS === "android" ? "10.0.2.2" : "localhost";

      console.log(`[Firebase] Connecting to emulators at ${debuggerHost}`);

      // Use modular emulator connection methods
      _authInstance.useEmulator(`http://${debuggerHost}:9099`); // Auth emulator
      _firestoreInstance.useEmulator(debuggerHost, 8080); // Firestore emulator
      _storageInstance.useEmulator(`http://${debuggerHost}:9199`); // Storage emulator

      console.log("[Firebase] Emulators connected");
    }

    // Listen to auth state changes for debugging
    _authInstance.onAuthStateChanged((user) => {
      // Corrected to use _authInstance
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
    // Fallback: If not initialized, try to get it from the default app, but warn.
    return getAuth(firebase.app());
  }
  return _authInstance;
};
export const getDbService = () => {
  if (!_firestoreInstance) {
    console.error(
      "Firebase Firestore service not initialized. Ensure initializeFirebaseServices() has been called.",
    );
    return getFirestore(firebase.app());
  }
  return _firestoreInstance;
};
export const getStorageService = () => {
  if (!_storageInstance) {
    console.error(
      "Firebase Storage service not initialized. Ensure initializeFirebaseServices() has been called.",
    );
    return getStorage(firebase.app());
  }
  return _storageInstance;
};

// Ensure signInWithEmailAndPassword is correctly imported from auth module
export { signInWithEmailAndPassword }; // This should now be available
