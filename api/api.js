import {
  createUserWithEmailAndPassword,
  deleteUser,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithCredential,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import {
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

import { ActionTypes } from "../src/constants";
import {
  app,
  auth,
  db,
  usersRef,
  productsRef,
  profileImagesRef,
} from "../src/firebase/config";

// Auth

export async function createUser(fullName, email, password) {
  try {
    const response = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const uid = response.user.uid;
    const data = {
      id: uid,
      email,
      fullName,
      locale: "en",
      theme: "lightBlue",
    };
    await addUserData(uid, data);
    return { uid }; // Returning the uid for potential use
  } catch (error) {
    alert(error.message);
  }
}

export async function deleteAccount() {
  const user = auth.currentUser;
  try {
    await deleteAllProductsFromUser(user.uid);
    await deleteUserData(user.uid);
    await deleteUser(user);
  } catch (error) {
    console.log("ERROR in deleteAccount ", error.message);
  }
}

export function authSignIn(email, password) {
  return signInWithEmailAndPassword(auth, email, password).catch((error) => {
    console.log("ERROR in authSignInc ", error.message);
  });
}

function isUserEqual(googleUser, firebaseUser) {
  if (firebaseUser) {
    const providerData = firebaseUser.providerData;
    for (let i = 0; i < providerData.length; i++) {
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
  const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
    unsubscribe();
    // Check if we are already signed-in Firebase with the correct user.
    if (!isUserEqual(googleUser, firebaseUser)) {
      // Build Firebase credential with the Google ID token.
      const credential = GoogleAuthProvider.credential(
        googleUser.idToken,
        googleUser.accessToken,
      );

      // Sign in with credential from the Google user.
      try {
        const result = await signInWithCredential(auth, credential);
        if (result.additionalUserInfo.isNewUser) {
          const uid = result.user.uid;
          const data = {
            id: uid,
            email: result.user.email,
            fullName: result.additionalUserInfo.profile.name,
            locale: result.additionalUserInfo.profile.locale,
            profileImg: result.additionalUserInfo.profile.picture,
            theme: "lightRed",
          };
          await addUserData(uid, data);
        }
      } catch (error) {
        console.log("onSignIn error", error);
      }
    } else {
      console.log("User already signed-in Firebase.");
    }
  });
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    onSignIn(result);
  } catch (error) {
    console.log("signInWithGoogle error: ", error.message);
  }
}

export function authSignOut() {
  return auth.signOut();
}

export function persistentLogin(callback, callbackData) {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const idToken = await user.getIdToken(true);
        const userData = await getUserData(user.uid);

        callbackData({
          ...userData,
        });
        callback({ type: ActionTypes.RESTORE_TOKEN, token: idToken, user });

        await getProfileImageFromFirebase(user.uid, callback);
      } catch (error) {
        console.log("Restoring token failed", error);
      }
    } else {
      callback({ type: ActionTypes.SIGN_OUT });
    }
  });
}

export function addUserData(uid, data) {
  return setDoc(doc(usersRef, uid), data).catch((error) =>
    console.log("Error adding user data: ", error),
  );
}

export function deleteUserData(uid) {
  return deleteDoc(doc(usersRef, uid)).catch((error) =>
    console.log("Error in deleteUserData: ", error),
  );
}

export async function getUserData(userID) {
  try {
    const response = await getDoc(doc(usersRef, userID));
    return response.data();
  } catch (error) {
    throw new Error("Error fetching user data: " + error.message);
  }
}

export function sendVerificationEmail() {
  const user = auth.currentUser;
  return sendEmailVerification(user);
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
  const productsQuery = query(
    productsRef,
    where("authorID", "==", userID),
    where("place", "==", place),
    orderBy("createdAt", "desc"),
  );

  const unsubscribe = onSnapshot(
    productsQuery,
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
    },
  );

  return unsubscribe;
};

export const getAllProducts = (userID, callback) => {
  const productsQuery = query(
    productsRef,
    where("authorID", "==", userID),
    orderBy("createdAt", "desc"),
  );

  const unsubscribe = onSnapshot(
    productsQuery,
    (querySnapshot) => {
      const products = [];
      querySnapshot.forEach((doc) => {
        const product = doc.data();
        product.id = doc.id;
        products.push(product);
      });
      callback(products);
    },
    (error) => {
      console.log("Error in getAllProducts", error);
    },
  );

  return unsubscribe;
};

export async function getProductById(id) {
  const productDocRef = doc(productsRef, id);
  try {
    const productDocSnap = await getDoc(productDocRef);
    return productDocSnap.data();
  } catch (error) {
    console.log("getProductById error: ", error);
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
  return setDoc(doc(productsRef, existingId), data).catch((error) => {
    alert(error);
  });
}

export function moveProduct(id, place) {
  return updateDoc(doc(productsRef, id), {
    place,
  }).catch((error) => console.log("Error in moveProduct: ", error));
}

export function deleteProduct(existingId) {
  return deleteDoc(doc(productsRef, existingId)).catch((error) => {
    console.log("Error in deleteProduct: ", error);
  });
}

export async function deleteAllProductsFromUser(uid) {
  try {
    const querySnapshot = await getDocs(
      query(productsRef, where("authorID", "==", uid)),
    );
    const batch = writeBatch(db);
    querySnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  } catch (error) {
    console.log("Error deleting products:", error);
  }
}

// Settings

export function uploadImage(id, blob, metadata) {
  return uploadBytesResumable(ref(profileImagesRef, `${id}`), blob, metadata);
}

export async function getProfileImageFromFirebase(userUID, callback) {
  try {
    const url = await getDownloadURL(ref(profileImagesRef, `${userUID}`));
    callback({ type: ActionTypes.PROFILE_IMG, imgUrl: url });
  } catch (error) {
    console.log("Profile img error:", error.message);
  }
}
export async function deleteProfileImage(userUID, callback) {
  try {
    await deleteObject(ref(profileImagesRef, `${userUID}`));
    callback({ type: ActionTypes.PROFILE_IMG, imgUrl: null });
  } catch (error) {
    console.log("Delete profile img error: ", error.message);
  }
}

export function changeColor(newTheme, id) {
  const data = {
    theme: newTheme,
  };
  return setDoc(doc(usersRef, id), data, { merge: true }).catch((error) =>
    console.log("Error: ", error),
  );
}

export function changeLanguage(newLocale, id) {
  const data = {
    locale: newLocale,
  };
  return setDoc(doc(usersRef, id), data, { merge: true }).catch((error) =>
    console.log("Error: ", error),
  );
}
