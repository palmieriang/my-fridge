import {
  API_KEY,
  AUTH_DOMAIN,
  DATABASE_URL,
  PROJECT_ID,
  MESSAGE_SENDER_ID,
  APP_ID,
} from "@env";
import { getAsyncStorage } from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
  connectAuthEmulator,
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
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(getAsyncStorage),
});

const db = getFirestore(app);
const usersRef = collection(db, "users");
const productsRef = collection(db, "products");

const storage = getStorage(app);
const storageRef = ref(storage);
const profileImagesRef = ref(storageRef, "profileImages/");

if (__DEV__) {
  console.log("Running in development mode");

  const debuggerHost = Platform.OS === "android" ? "10.0.2.2" : "localhost";

  connectAuthEmulator(auth, `http://${debuggerHost}:9099/`);
  connectFirestoreEmulator(db, debuggerHost, 8080);
  connectStorageEmulator(storage, debuggerHost, 9199);
}

export { app, auth, usersRef, productsRef, profileImagesRef };
