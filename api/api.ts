import { getApp } from "@react-native-firebase/app";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  getIdToken,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut,
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
  FirebaseFirestoreTypes,
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
import type { NewProduct, Product, UserData } from "../src/store/types";

// Auth

export async function createUser(
  fullName: string,
  email: string,
  password: string,
) {
  try {
    const { user } = await createUserWithEmailAndPassword(
      getAuthService(),
      email,
      password,
    );
    const userData: UserData = {
      id: user.uid,
      email,
      fullName,
      locale: "en",
      theme: "lightBlue",
    };
    await addUserData(user.uid, userData);
    await sendEmailVerification(user);
    return { uid: user.uid };
  } catch (error: any) {
    Alert.alert("Error creating user", error.message);
  }
}

export async function deleteAccount() {
  const user = getAuthService().currentUser;
  if (!user) return;

  try {
    await deleteAllProductsFromUser(user.uid);
    await deleteUserData(user.uid);

    await (async () => {
      try {
        await deleteProfileImage(user.uid);
        console.log("Profile image deleted for user:", user.uid);
      } catch (error: any) {
        if (error.code !== "storage/object-not-found") {
          console.error("Delete profile img error: ", error);
        }
      }
    })();

    await deleteUser(user);

    console.log("User account deleted:", user.uid);
  } catch (error: any) {
    console.log("ERROR in deleteAccount ", error.message);
    Alert.alert("Account Deletion Failed", error.message);
  }
}

export function authSignIn(email: string, password: string) {
  console.log("authSignIn :", email);
  return signInWithEmailAndPassword(getAuthService(), email, password).catch(
    (error: any) => {
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
      offlineAccess: true,
    });

    await GoogleSignin.hasPlayServices();

    const userInfo = await GoogleSignin.signIn();

    const credential = GoogleAuthProvider.credential(userInfo?.data?.idToken);

    const { user, additionalUserInfo } = await signInWithCredential(
      getAuthService(),
      credential,
    );

    if (additionalUserInfo?.isNewUser) {
      const userData: UserData = {
        id: user.uid,
        email: user.email ?? "",
        fullName: user.displayName ?? "",
        locale: additionalUserInfo.profile?.locale ?? "en",
        profileImg: user.photoURL ?? undefined,
        theme: "lightBlue",
      };
      await addUserData(user.uid, userData);
      console.log("New user created via Google:", user.uid);
    } else {
      console.log("Existing user signed in via Google:", user.uid);
    }

    return { user };
  } catch (error: any) {
    console.log("Google Sign-In error:", error);
    if (error.code !== statusCodes.SIGN_IN_CANCELLED) {
      console.log("Google Sign-In error:", error);
      Alert.alert("Google Sign-In Failed", error.message);
    }
    throw error;
  }
}

export async function authSignOut(dispatch?: Function) {
  try {
    await signOut(getAuthService());
    console.log("User logged out");
    dispatch?.({ type: ActionTypes.SIGN_OUT });
  } catch (error: any) {
    console.error("Error signing out:", error);
    Alert.alert("Logout Failed", error.message);
  }
}

export function persistentLogin(
  callback: Function,
  callbackData: (data: UserData) => void,
) {
  return onAuthStateChanged(getAuthService(), async (user) => {
    if (user) {
      try {
        const idToken = await getIdToken(user);
        const userData = await getUserData(user.uid);
        callbackData(userData);
        callback({ type: ActionTypes.RESTORE_TOKEN, token: idToken, user });
        await getProfileImageFromFirebase(user.uid, callback);
      } catch (error: any) {
        console.log("Restoring token failed", error);
        Alert.alert("Authentication Failed", error.message);
        callback({ type: ActionTypes.SIGN_OUT });
      }
    } else {
      callback({ type: ActionTypes.SIGN_OUT });
    }
  });
}

export function sendResetPassword(email: string) {
  return sendPasswordResetEmail(getAuthService(), email);
}

// Firestore: Users

export function addUserData(uid: string, data: UserData) {
  return setDoc(doc(getUsersRef(), uid), data).catch((error: any) =>
    console.log("Error adding user data: ", error),
  );
}

export function deleteUserData(uid: string) {
  return deleteDoc(doc(getUsersRef(), uid)).catch((error: any) =>
    console.log("Error in deleteUserData: ", error),
  );
}

export async function getUserData(userID: string) {
  const snapshot = await getDoc(doc(getUsersRef(), userID));
  if (!snapshot.exists())
    throw new Error("User data not found for ID: " + userID);

  return snapshot.data() as UserData;
}

// Firestore: Products

export function saveProduct(data: NewProduct) {
  return setDoc(doc(getProductsRef()), {
    ...data,
    createdAt: serverTimestamp(),
  }).catch((error: any) => Alert.alert("Error saving product", error.message));
}

export function getProductsFromPlace(
  userID: string,
  place: "fridge" | "freezer",
  callback: (products: Product[]) => void,
) {
  const productsQuery = query(
    getProductsRef(),
    where("authorID", "==", userID),
    where("place", "==", place),
    orderBy("createdAt", "desc"),
  );

  return onSnapshot(
    productsQuery,
    (snapshot) => {
      const products = snapshot.docs.map(
        (doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => ({
          ...doc.data(),
          id: doc.id,
        }),
      );
      callback(products);
    },
    (error: any) => {
      console.log("getProductsFromPlace ", error);
      Alert.alert("Error fetching products", error.message);
    },
  );
}

export function getAllProducts(
  userID: string,
  callback: (products: Product[]) => void,
) {
  const productsQuery = query(
    getProductsRef(),
    where("authorID", "==", userID),
    orderBy("createdAt", "desc"),
  );

  return onSnapshot(
    productsQuery,
    (snapshot) => {
      const products = snapshot.docs.map(
        (doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => ({
          ...doc.data(),
          id: doc.id,
        }),
      ) as Product[];
      callback(products);
    },
    (error: any) => {
      console.log("Error in getAllProducts", error);
      Alert.alert("Error fetching all products", error.message);
    },
  );
}

export async function getProductById(id: string): Promise<Product | undefined> {
  try {
    const productDoc = await getDoc(doc(getProductsRef(), id));
    return productDoc.exists() ? (productDoc.data() as Product) : undefined;
  } catch (error: any) {
    console.log("getProductById error: ", error);
    Alert.alert("Error fetching product", error.message);
  }
}

export function modifyProduct(data: NewProduct, id: string) {
  return setDoc(doc(getProductsRef(), id), {
    ...data,
    id,
    createdAt: serverTimestamp(),
  }).catch((error: any) =>
    Alert.alert("Error modifying product", error.message),
  );
}

export async function moveProduct(id: string, place: "fridge" | "freezer") {
  try {
    await updateDoc(doc(getProductsRef(), id), {
      place,
    });
  } catch (error: any) {
    console.log("Error in moveProduct: ", error);
    Alert.alert("Error moving product", error.message);
  }
}

export async function deleteProduct(id: string) {
  try {
    await deleteDoc(doc(getProductsRef(), id));
  } catch (error: any) {
    console.log("Error in deleteProduct: ", error);
    Alert.alert("Error deleting product", error.message);
  }
}

export async function deleteAllProductsFromUser(uid: string) {
  try {
    const snapshot = await getDocs(
      query(getProductsRef(), where("authorID", "==", uid)),
    );
    const batch = writeBatch(getDbService());
    snapshot.forEach((doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) =>
      batch.delete(doc.ref),
    );
    await batch.commit();
  } catch (error: any) {
    console.log("Error deleting products:", error);
    Alert.alert("Error deleting all products", error.message);
  }
}

// Storage

export function uploadImage(id: string, blob: Blob, metadata?: any) {
  const storageRef = ref(getStorage(getApp()), `profileImages/${id}`);
  return uploadBytesResumable(storageRef, blob, metadata);
}

export async function getProfileImageFromFirebase(
  userUID: string,
  callback: Function,
) {
  try {
    const url = await getDownloadURL(
      ref(getStorage(getApp()), `profileImages/${userUID}`),
    );
    callback({ type: ActionTypes.PROFILE_IMG, imgUrl: url });
  } catch (error: any) {
    console.log("Profile img error:", error.message);
    callback({ type: ActionTypes.PROFILE_IMG, imgUrl: null });
  }
}

export async function deleteProfileImage(userUID: string, callback?: Function) {
  try {
    await deleteObject(ref(getStorage(getApp()), `profileImages/${userUID}`));
    callback?.({ type: ActionTypes.PROFILE_IMG, imgUrl: null });
  } catch (error: any) {
    console.log("DEBUG Delete profile img error: ", error);
    if (error.code !== "storage/object-not-found" && callback) {
      Alert.alert("Error deleting profile image", error.message);
    }
    callback?.({ type: ActionTypes.PROFILE_IMG, imgUrl: null });
  }
}

// Settings

export function changeColor(theme: string, id: string) {
  return setDoc(doc(getUsersRef(), id), { theme }, { merge: true }).catch(
    (error: any) => console.log("Error: ", error),
  );
}

export function changeLanguage(locale: string, id: string) {
  return setDoc(doc(getUsersRef(), id), { locale }, { merge: true }).catch(
    (error: any) => console.log("Error: ", error),
  );
}
