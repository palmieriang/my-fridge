import {
  API_KEY,
  AUTH_DOMAIN,
  DATABASE_URL,
  PROJECT_ID,
  MESSAGE_SENDER_ID,
  APP_ID,
} from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
  connectAuthEmulator,
  getAuth,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  connectFirestoreEmulator,
} from "firebase/firestore";
import { getStorage, ref, connectStorageEmulator } from "firebase/storage";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  databaseURL: DATABASE_URL,
  projectId: PROJECT_ID,
  storageBucket: "my-native-fridge.appspot.com",
  messagingSenderId: MESSAGE_SENDER_ID,
  appId: APP_ID,
};

const app = initializeApp(firebaseConfig);

let auth;
let db;
let storage;
let usersRef;
let productsRef;
let profileImagesRef;

export const initializeFirebaseServices = async () => {
  if (!auth) {
    try {
      auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });

      if (__DEV__) {
        const debuggerHost =
          Platform.OS === "android" ? "10.0.2.2" : "localhost";
        connectAuthEmulator(auth, `http://${debuggerHost}:9099`);
      }
    } catch (e) {
      console.error("Failed to initialize Firebase Auth:", e);
    }
  }

  if (!db) {
    db = getFirestore(app);
    usersRef = collection(db, "users");
    productsRef = collection(db, "products");

    if (__DEV__) {
      const debuggerHost = Platform.OS === "android" ? "10.0.2.2" : "localhost";
      connectFirestoreEmulator(db, debuggerHost, 8080);
    }
  }

  if (!storage) {
    storage = getStorage(app);
    const storageRootRef = ref(storage);
    profileImagesRef = ref(storageRootRef, "profileImages/");

    if (__DEV__) {
      const debuggerHost = Platform.OS === "android" ? "10.0.2.2" : "localhost";
      connectStorageEmulator(storage, debuggerHost, 9199);
    }
  }
};

export const getAuthService = () => auth || getAuth(app);
export const getDbService = () => db;
export const getStorageService = () => storage;
export const getUsersRef = () => usersRef;
export const getProductsRef = () => productsRef;
export const getProfileImagesRef = () => profileImagesRef;

export { app };
