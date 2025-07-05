import {
  createUserWithEmailAndPassword,
  deleteUser,
  // GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification,
  // signInWithCredential,
  signInWithEmailAndPassword,
  // signInWithPopup, // This is only available in web
} from "@react-native-firebase/auth";
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
} from "@react-native-firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "@react-native-firebase/storage";
import { Alert } from "react-native";

import { ActionTypes } from "../src/constants";
import {
  getAuthService,
  getDbService,
  getUsersRef,
  getProductsRef,
  getProfileImagesRef,
  getStorageService,
} from "../src/firebase/config";

// Auth

export async function createUser(fullName, email, password) {
  try {
    const response = await createUserWithEmailAndPassword(
      getAuthService(),
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
    Alert.alert("Error creating user", error.message);
  }
}

export async function deleteAccount() {
  const user = getAuthService().currentUser;
  if (!user) {
    console.log("No user is currently signed in to delete account.");
    return;
  }

  try {
    await deleteAllProductsFromUser(user.uid);
    await deleteUserData(user.uid);
    await deleteProfileImage(user.uid);
    await deleteUser(user);
  } catch (error) {
    console.log("ERROR in deleteAccount ", error.message);
    Alert.alert("Account Deletion Failed", error.message);
  }
}

export function authSignIn(email, password) {
  console.log("authSignIn :", email);
  return signInWithEmailAndPassword(getAuthService(), email, password).catch(
    (error) => {
      console.log("ERROR in authSignIn ", error.message);
      Alert.alert("Sign In Failed", error.message);
    },
  );
}

// function isUserEqual(googleUser, firebaseUser) {
//   if (firebaseUser) {
//     const providerData = firebaseUser.providerData;
//     for (let i = 0; i < providerData.length; i++) {
//       if (
//         providerData[i].providerId === GoogleAuthProvider.PROVIDER_ID &&
//         providerData[i].uid === googleUser.user.id // or googleUser.getBasicProfile().getId() or googleUser.getId()
//       ) {
//         // We don't need to reauth the Firebase connection.
//         return true;
//       }
//     }
//   }
//   return false;
// }

// function onSignIn(googleUser) {
//   // We need to register an Observer on Firebase Auth to make sure auth is initialized.
//   const unsubscribe = onAuthStateChanged(
//     getAuthService(),
//     async (firebaseUser) => {
//       unsubscribe();
//       // Check if we are already signed-in Firebase with the correct user.
//       if (!isUserEqual(googleUser, firebaseUser)) {
//         // Build Firebase credential with the Google ID token.
//         const credential = GoogleAuthProvider.credential(
//           googleUser.idToken,
//           googleUser.accessToken,
//         );

//         // Sign in with credential from the Google user.
//         try {
//           const result = await signInWithCredential(getAuthService(), credential);
//           if (result.additionalUserInfo.isNewUser) {
//             const uid = result.user.uid;
//             const data = {
//               id: uid,
//               email: result.user.email,
//               fullName: result.additionalUserInfo.profile.name,
//               locale: result.additionalUserInfo.profile.locale,
//               profileImg: result.additionalUserInfo.profile.picture,
//               theme: "lightRed",
//             };
//             await addUserData(uid, data);
//           }
//         } catch (error) {
//           console.log("onSignIn error", error);
//         }
//       } else {
//         console.log("User already signed-in Firebase.");
//       }
//     },
//   );
// }

// export async function signInWithGoogle() {
//   const provider = new GoogleAuthProvider();
//   try {
//     const result = await signInWithPopup(getAuthService(), provider); // this is only available in web
//     onSignIn(result);
//   } catch (error) {
//     console.log("signInWithGoogle error: ", error.message);
//   }
// }

export function authSignOut() {
  return getAuthService().signOut();
}

export function persistentLogin(callback, callbackData) {
  return onAuthStateChanged(getAuthService(), async (user) => {
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
        Alert.alert("Authentication Failed", error.message);
      }
    } else {
      callback({ type: ActionTypes.SIGN_OUT });
    }
  });
}

export function addUserData(uid, data) {
  return setDoc(doc(getUsersRef(), uid), data).catch((error) =>
    console.log("Error adding user data: ", error),
  );
}

export function deleteUserData(uid) {
  return deleteDoc(doc(getUsersRef(), uid)).catch((error) =>
    console.log("Error in deleteUserData: ", error),
  );
}

export async function getUserData(userID) {
  try {
    const response = await getDoc(doc(getUsersRef(), userID));
    return response.data();
  } catch (error) {
    throw new Error("Error fetching user data: " + error.message);
  }
}

export function sendVerificationEmail() {
  const user = getAuthService().currentUser;
  if (!user) {
    console.log("No user is signed in to send verification email.");
    return Promise.reject(new Error("No user signed in."));
  }

  return sendEmailVerification(user);
}

export function sendResetPassword(email) {
  return sendPasswordResetEmail(getAuthService(), email);
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
  return setDoc(doc(getProductsRef()), data).catch((error) => {
    Alert.alert("Error saving product", error.message);
  });
  // if setDoc doesn't work, try addDoc
  // return addDoc(getProductsRef(), data).catch((error) => {
  //   Alert.alert("Error saving product", error.message);
  // });
}

export const getProductsFromPlace = (userID, place, callback) => {
  const productsQuery = query(
    getProductsRef(),
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
      Alert.alert("Error fetching products", error.message);
    },
  );

  return unsubscribe;
};

export const getAllProducts = (userID, callback) => {
  const productsQuery = query(
    getProductsRef(),
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
      Alert.alert("Error fetching all products", error.message);
    },
  );

  return unsubscribe;
};

export async function getProductById(id) {
  const productDocRef = doc(getProductsRef(), id);
  try {
    const productDocSnap = await getDoc(productDocRef);
    return productDocSnap.data();
  } catch (error) {
    console.log("getProductById error: ", error);
    Alert.alert("Error fetching product", error.message);
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
  return setDoc(doc(getProductsRef(), existingId), data).catch((error) => {
    Alert.alert("Error modifying product", error.message);
  });
}

export function moveProduct(id, place) {
  return updateDoc(doc(getProductsRef(), id), {
    place,
  }).catch((error) => {
    console.log("Error in moveProduct: ", error);
    Alert.alert("Error moving product", error.message);
  });
}

export function deleteProduct(existingId) {
  return deleteDoc(doc(getProductsRef(), existingId)).catch((error) => {
    console.log("Error in deleteProduct: ", error);
    Alert.alert("Error deleting product", error.message);
  });
}

export async function deleteAllProductsFromUser(uid) {
  try {
    const querySnapshot = await getDocs(
      query(getProductsRef(), where("authorID", "==", uid)),
    );
    const batch = writeBatch(getDbService());
    querySnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  } catch (error) {
    console.log("Error deleting products:", error);
    Alert.alert("Error deleting all products", error.message);
  }
}

// Settings

export function uploadImage(id, blob, metadata) {
  return uploadBytesResumable(
    ref(getProfileImagesRef(), `${id}`),
    blob,
    metadata,
  );
}

export async function getProfileImageFromFirebase(userUID, callback) {
  try {
    const url = await getDownloadURL(ref(getProfileImagesRef(), `${userUID}`));
    callback({ type: ActionTypes.PROFILE_IMG, imgUrl: url });
  } catch (error) {
    console.log("Profile img error:", error.message);
    Alert.alert("Error fetching profile image", error.message);
    callback({ type: ActionTypes.PROFILE_IMG, imgUrl: null });
  }
}
export async function deleteProfileImage(userUID, callback) {
  try {
    await deleteObject(ref(getProfileImagesRef(), `${userUID}`));
    callback({ type: ActionTypes.PROFILE_IMG, imgUrl: null });
  } catch (error) {
    console.log("Delete profile img error: ", error.message);
    Alert.alert("Error deleting profile image", error.message);
    callback({ type: ActionTypes.PROFILE_IMG, imgUrl: null });
  }
}

export function changeColor(newTheme, id) {
  const data = {
    theme: newTheme,
  };
  return setDoc(doc(getUsersRef(), id), data, { merge: true }).catch((error) =>
    console.log("Error: ", error),
  );
}

export function changeLanguage(newLocale, id) {
  const data = {
    locale: newLocale,
  };
  return setDoc(doc(getUsersRef(), id), data, { merge: true }).catch((error) =>
    console.log("Error: ", error),
  );
}
