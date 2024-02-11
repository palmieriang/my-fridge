import { initializeApp } from 'firebase/app';
import { getFirestore, collection } from "firebase/firestore";
import { getStorage, ref } from 'firebase/storage';
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  API_KEY,
  AUTH_DOMAIN,
  DATABASE_URL,
  PROJECT_ID,
  MESSAGE_SENDER_ID,
  APP_ID,
} from '@env';

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  databaseURL: DATABASE_URL,
  projectId: PROJECT_ID,
  storageBucket: 'my-native-fridge.appspot.com',
  messagingSenderId: MESSAGE_SENDER_ID,
  appId: APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

const db = getFirestore(app);
const usersRef = collection(db, 'users');
const productsRef = collection(db, 'products');

const storage = getStorage(app);
const storageRef = ref(storage);
const profileImagesRef = ref(storageRef, 'profileImages/');

export {
  app, auth, usersRef, productsRef, profileImagesRef
};
