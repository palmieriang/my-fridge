import { getApp } from "@react-native-firebase/app";
import {
  createUserWithEmailAndPassword,
  getIdToken,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithCredential,
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
  getStorage,
  ref,
  uploadBytesResumable,
} from "@react-native-firebase/storage";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { Alert } from "react-native";

import { ActionTypes } from "../src/constants";
import {
  getAuthService,
  getDbService,
  getUsersRef,
  getProductsRef,
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

    await (async () => {
      try {
        await deleteProfileImage(user.uid);
        console.log("Profile image deleted for user:", user.uid);
      } catch (storageError) {
        if (storageError.code === 'storage/object-not-found') {
          console.log("No profile image found for user:", user.uid, "Skipping deletion.");
        } else {
          console.error("Delete profile img error: ", storageError);
        }
      }
    })();

    await user.delete();

    console.log("User account deleted:", user.uid);
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

export async function signInWithGoogle() {
  try {
    GoogleSignin.configure({
      webClientId:
        "730096168799-tp1s3ttqstv44r6cm5p94aptetet47jg.apps.googleusercontent.com",
      iosClientId:
        "730096168799-reud7qc0fd59t8onecgupqihpcoccs5o.apps.googleusercontent.com",
      // androidClientId: 'YOUR_ANDROID_CLIENT_ID', // <--- You can add this if you explicitly want to use it
      offlineAccess: true,
    });

    await GoogleSignin.hasPlayServices();

    const userInfo = await GoogleSignin.signIn();

    const googleCredential = GoogleAuthProvider.credential(userInfo.data.idToken);

    const firebaseSignInResult = await signInWithCredential(
      getAuthService(),
      googleCredential,
    );

    if (firebaseSignInResult.additionalUserInfo.isNewUser) {
      const uid = firebaseSignInResult.user.uid;
      const data = {
        id: uid,
        email: firebaseSignInResult.user.email,
        fullName: firebaseSignInResult.user.displayName,
        locale: firebaseSignInResult.additionalUserInfo.profile.locale || "en",
        profileImg:
          firebaseSignInResult.user.photoURL,
        theme: "lightBlue",
      };
      await addUserData(uid, data);
      console.log("New user created via Google:", uid);
    } else {
      console.log(
        "Existing user signed in via Google:",
        firebaseSignInResult.user.uid,
      );
    }

    return { user: firebaseSignInResult.user };
  } catch (error) {
    console.log("Google Sign-In error:", error);
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      console.log("Google Sign-In cancelled by user");
    } else if (error.code === statusCodes.IN_PROGRESS) {
      console.log("Google Sign-In already in progress");
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      Alert.alert(
        "Google Play Services Not Available",
        "Please update Google Play Services to use Google Sign-In.",
      );
    } else {
      console.log("Google Sign-In error:", error);
      Alert.alert("Google Sign-In Failed", error.message);
    }
    throw error; // Re-throw the error so calling components can also handle it if needed
  }
}

export function authSignOut() {
  return getAuthService().signOut();
}

export function persistentLogin(callback, callbackData) {
  return onAuthStateChanged(getAuthService(), async (user) => {
    if (user) {
      try {
        const idToken = await getIdToken(user);
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
  console.log("Adding user data for UID:", uid, data);
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

export async function sendVerificationEmail() {
  const user = getAuthService().currentUser;
  if (!user) {
    console.log("No user is signed in to send verification email.");
    return Promise.reject(new Error("No user signed in."));
  }

  try {
    await user.sendEmailVerification();
  } catch (error) {
    console.log("Error sending verification email: ", error.message);
    Alert.alert("Error", "Failed to send verification email. " + error.message);
    throw error;
  }  
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
  const storageInstance = getStorage(getApp());
  const storageRef = ref(storageInstance, `profileImages/${id}`);
  return uploadBytesResumable(storageRef, blob, metadata);
}

export async function getProfileImageFromFirebase(userUID, callback) {
  try {
    const storageInstance = getStorage(getApp());
    const storageRef = ref(storageInstance, `profileImages/${userUID}`);
    const url = await getDownloadURL(storageRef);
    callback({ type: ActionTypes.PROFILE_IMG, imgUrl: url });
  } catch (error) {
    console.log("Profile img error:", error.message);
    callback({ type: ActionTypes.PROFILE_IMG, imgUrl: null });
  }
}

export async function deleteProfileImage(userUID, callback) {
  try {
    const storageInstance = getStorage(getApp());
    const storageRef = ref(storageInstance, `profileImages/${userUID}`);
    await deleteObject(storageRef);
    if (callback) {
      callback({ type: ActionTypes.PROFILE_IMG, imgUrl: null });
    }
  } catch (error) {
    console.log("DEBUG Delete profile img error: ", error);
   if (error.code !== 'storage/object-not-found' && callback) {
      Alert.alert("Error deleting profile image", error.message);
    }
    if (callback) {
      callback({ type: ActionTypes.PROFILE_IMG, imgUrl: null });
    }
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
