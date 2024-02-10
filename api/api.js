import moment from 'moment';
import { signInWithEmailAndPassword, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { orderBy, query, where, getDoc, setDoc, doc, onSnapshot, serverTimestamp, deleteDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, deleteObject, uploadBytesResumable } from 'firebase/storage';
import {
  app,
  auth,
  usersRef,
  productsRef,
  profileImagesRef,
} from '../src/firebase/config';

// Auth

export function createUser(fullName, email, password) {
  return auth
    .createUserWithEmailAndPassword(email, password)
    .then((response) => {
      const uid = response.user.uid;
      const data = {
        id: uid,
        email,
        fullName,
        locale: 'en',
        theme: 'lightBlue',
      };
      addUserData(uid, data);
    })
    .catch((error) => alert(error.message));
}

export function authSignIn(email, password) {
  signInWithEmailAndPassword(auth, email, password)
    .catch((error) => {
      console.log("ERROR in authSignInc ", error.message);
    });
}

function isUserEqual(googleUser, firebaseUser) {
  if (firebaseUser) {
    var providerData = firebaseUser.providerData;
    for (var i = 0; i < providerData.length; i++) {
      if (
        providerData[i].providerId ===
        app.auth.GoogleAuthProvider.PROVIDER_ID &&
        providerData[i].uid === googleUser.user.id
      ) {
        // We don't need to reauth the Firebase connection.
        return true;
      }
    }
  }
  return false;
}

function onSignIn(googleUser) {
  // We need to register an Observer on Firebase Auth to make sure auth is initialized.
  const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
    unsubscribe();
    // Check if we are already signed-in Firebase with the correct user.
    if (!isUserEqual(googleUser, firebaseUser)) {
      // Build Firebase credential with the Google ID token.
      const credential = GoogleAuthProvider.credential(
        googleUser.idToken,
        googleUser.accessToken
      );

      // Sign in with credential from the Google user.
      auth
        .signInWithCredential(credential)
        .then((result) => {
          if (result.additionalUserInfo.isNewUser) {
            const uid = result.user.uid;
            const data = {
              id: uid,
              email: result.user.email,
              fullName: result.additionalUserInfo.profile.name,
              locale: result.additionalUserInfo.profile.locale,
              profileImg: result.additionalUserInfo.profile.picture,
              theme: 'lightRed',
            };
            addUserData(uid, data);
          }
        })
        .catch((error) => {
          console.log('onSignIn error', error);
        });
    } else {
      console.log('User already signed-in Firebase.');
    }
  });
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    onSignIn(result);
  } catch (error) {
    console.log('signInWithGoogle error: ', error.message);
  }
}

export function authSignOut() {
  return auth.signOut();
}

export function persistentLogin(callback, callbackData) {
  console.log('PERSISTEN LOGIN ');
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('user persistent ', user);
      user
        .getIdToken(true)
        .then(async (idToken) => {
          console.log('idToken ', idToken);
          try {
            getUserData(user.uid).then((userData) => {
              console.log('userData HERE ', userData);

              callbackData({
                email: userData.email,
                fullName: userData.fullName,
                id: userData.id,
                locale: userData.locale,
                theme: userData.theme,
              });
              callback({
                type: 'RESTORE_TOKEN',
                token: idToken,
                user,
              });
            })
              .catch((error) => {
                console.log('GET USER DATA ERROR: ', error);
              });

            getProfileImageFromFirebase(user.uid, callback);
          } catch (error) {
            console.log('Restoring token failed', error);
          }
        })
        .catch((error) => {
          console.log('idToken failed', error);
        });
    } else {
      callback({ type: 'SIGN_OUT' });
    }
  });
}

export function addUserData(uid, data) {
  return usersRef
    .doc(uid)
    .set(data)
    .catch((error) => console.log('Error adding user data: ', error));
}

export async function getUserData(userID) {
  try {
    const response = await getDoc(doc(usersRef, userID));
    return response.data();
  } catch (error) {
    throw new Error('Error fetching user data: ' + error.message);
  }
}

export function sendVerificationEmail() {
  const user = auth.currentUser;
  return user.sendEmailVerification();
}

export function sendResetPassword(email) {
  return auth.sendPasswordResetEmail(email);
}

// Products

export function saveProduct({ name, date, place, authorID }) {
  const timestamp = serverTimestamp();
  const data = {
    name,
    date,
    place,
    authorID,
    createdAt: timestamp,
  };
  return setDoc(doc(productsRef), data).catch((error) => {
    alert(error);
  });
}

export const getProductsFromPlace = (userID, place, callback) => {
  const productsQuery = query(productsRef, where('authorID', '==', userID), where('place', '==', place), orderBy('createdAt', 'desc'));

  const unsubscribe = onSnapshot(productsQuery,
    (querySnapshot) => {
      const newProducts = [];
      querySnapshot.forEach((doc) => {
        const product = doc.data();
        product.id = doc.id;
        newProducts.push(product);
      });
      callback(newProducts);
    },
    (error) => {
      console.log("getProductsFromPlace ", error);
    }
  );

  return unsubscribe;
};

export const getAllProducts = (userID, callback) => {
  const productsQuery = query(
    productsRef,
    where('authorID', '==', userID),
    orderBy('createdAt', 'desc')
  );

  const unsubscribe = onSnapshot(
    productsQuery,
    (querySnapshot) => {
      const products = [];
      querySnapshot.forEach((doc) => {
        const product = doc.data();
        product.id = doc.id;
        product.date = new Date(product.date);
        products.push(product);
      });
      callback(products);
    },
    (error) => {
      console.log(error);
    }
  );

  return unsubscribe;
};

export async function getProductById(id) {
  const productDocRef = doc(productsRef, id);
  try {
    const productDocSnap = await getDoc(productDocRef);
    return productDocSnap.data();
  } catch (error) {
    console.log('getProductById error: ', error);
  }
}

export function modifyProduct({ name, date, place, authorID }, existingId) {
  const timestamp = serverTimestamp();
  const data = {
    name,
    date,
    place,
    authorID,
    createdAt: timestamp,
  };
  return setDoc(doc(productsRef, existingId), data)
    .catch((error) => {
      alert(error);
    });
}

export function moveProduct(id, place) {
  return updateDoc(doc(productsRef, id), {
    place,
  })
    .catch((error) => console.log('Error: ', error));
}

export function deleteProduct(existingId) {
  return deleteDoc(doc(productsRef, existingId)).catch((error) => {
    console.log('Error in deleteProduct: ', error);
  });
}

// Settings

export function uploadTaskFromApi(id, blob, metadata) {
  return uploadBytesResumable(ref(profileImagesRef, `${id}`), blob, metadata);
}

export async function getProfileImageFromFirebase(userUID, callback) {
  try {
    const url = await getDownloadURL(ref(profileImagesRef, `${userUID}`));
    console.log(url);
    callback({ type: 'PROFILE_IMG', imgUrl: url });
  } catch (error) {
    console.log('Profile img error:', error.message);
  }
}
export async function deleteProfileImage(userUID, callback) {
  try {
    await deleteObject(ref(profileImagesRef, `${userUID}`));
    callback({ type: 'PROFILE_IMG', imgUrl: null });
  } catch (error) {
    console.log('Delete profile img error: ', error.message);
  }
}

export function changeColor(newTheme, id) {
  const data = {
    theme: newTheme,
  };
  return setDoc(doc(usersRef, id), data, { merge: true })
    .catch((error) => console.log('Error: ', error));
}

export function changeLanguage(newLocale, id) {
  const data = {
    locale: newLocale,
  };
  return setDoc(doc(usersRef, id), data, { merge: true })
  .catch((error) => console.log('Error: ', error));
}

// Utils

export function formatDate(dateString) {
  const parsed = moment(new Date(dateString));

  if (!parsed.isValid()) {
    return dateString;
  }

  return parsed.format('D MMM YYYY');
}

export function formatDateTime(dateString) {
  const parsed = moment(new Date(dateString));

  if (!parsed.isValid()) {
    return dateString;
  }

  return parsed.format('H A on D MMM YYYY');
}

export function getCountdownParts(eventDate) {
  const duration = moment.duration(
    moment(new Date(eventDate)).diff(new Date())
  );

  return {
    days: parseInt(duration.as('days')),
    hours: duration.get('hours'),
    minutes: duration.get('minutes'),
    seconds: duration.get('seconds'),
  };
}
