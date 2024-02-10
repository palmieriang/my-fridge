import { initializeApp } from 'firebase/app';
import { getFirestore, collection } from "firebase/firestore";
import { getStorage, ref } from 'firebase/storage';
import { getAuth } from "firebase/auth";
import '@firebase/auth';
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

const db = getFirestore(app);
const auth = getAuth(app);
const usersRef = collection(db, 'users');
const productsRef = collection(db, 'products');
const storage = getStorage(app);
const storageRef = ref(storage);
const imagesRef = ref(storageRef, 'images');
const imagesRefTest = ref(storageRef, 'profileImages/');
// console.log("usersRef ", usersRef);
// console.log("imagesRefTest ", imagesRefTest);

export {
  app, db, auth, usersRef, productsRef, imagesRef
};
