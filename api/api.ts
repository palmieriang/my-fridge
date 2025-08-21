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
  ref,
  putFile,
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
  getStorageService,
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
    // Create user document (triggers Cloud Function for additional setup)
    const userData: UserData = {
      id: user.uid,
      email,
      fullName,
      locale: "en",
      theme: "lightBlue",
    };
    await addUserData(user.uid, userData);
    console.log("User document created, Cloud Function will handle setup");
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
    // Step 1: Delete user document first (triggers Cloud Function cleanup)
    await deleteUserData(user.uid);
    console.log("User document deleted, Cloud Function will clean up data");

    // Step 2: Delete Firebase Auth user (this should be last)
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

export async function signInWithGoogle(dispatch?: Function) {
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
      // Create user document (triggers Cloud Function for additional setup)
      const userData: UserData = {
        id: user.uid,
        email: user.email ?? "",
        fullName: user.displayName ?? "",
        locale: additionalUserInfo.profile?.locale ?? "en",
        profileImg: user.photoURL ?? undefined,
        theme: "lightBlue",
      };
      await addUserData(user.uid, userData);
      console.log(
        "New Google user document created, Cloud Function will handle setup",
      );
    } else {
      console.log("Existing user signed in via Google:", user.uid);
      // Existing users keep their current profile image setup
      // No automatic updates to avoid overriding user preferences
    }

    if (dispatch) {
      if (user.photoURL) {
        dispatch({ type: ActionTypes.PROFILE_IMG, imgUrl: user.photoURL });
      } else {
        // Fallback to getting from stored user data or storage
        await getProfileImageFromFirebase(user.uid, dispatch);
      }
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
        const userData = await getUserDataWithRetry(user.uid);
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

export async function addUserData(uid: string, data: UserData) {
  try {
    await setDoc(doc(getUsersRef(), uid), data);
  } catch (error: any) {
    console.error("Error adding user data:", error);
  }
}

export function deleteUserData(uid: string) {
  return deleteDoc(doc(getUsersRef(), uid)).catch((error: any) =>
    console.log("Error in deleteUserData: ", error),
  );
}

export async function getUserData(uid: string) {
  const snapshot = await getDoc(doc(getUsersRef(), uid));
  if (!snapshot.exists()) {
    throw new Error("User data not found for ID: " + uid);
  }

  return snapshot.data() as UserData;
}

async function getUserDataWithRetry(
  uid: string,
  maxRetries: number = 3,
  delay: number = 1000,
): Promise<UserData> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      if (i > 0) {
        console.log(`[getUserData] Retry attempt ${i + 1} for user:`, uid);
      }
      return await getUserData(uid);
    } catch (error: any) {
      console.log(`[getUserData] Attempt ${i + 1} failed:`, error.message);

      if (i === maxRetries - 1) {
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new Error("Max retries exceeded");
}

// Firestore: Products

export function saveProduct(data: NewProduct) {
  return setDoc(doc(getProductsRef()), {
    ...data,
    createdAt: serverTimestamp(),
  }).catch((error: any) => Alert.alert("Error saving product", error.message));
}

export function getProductsFromPlace(
  uid: string,
  place: "fridge" | "freezer",
  callback: (products: Product[]) => void,
) {
  const productsQuery = query(
    getProductsRef(),
    where("authorID", "==", uid),
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
  uid: string,
  callback: (products: Product[]) => void,
) {
  const productsQuery = query(
    getProductsRef(),
    where("authorID", "==", uid),
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

// Storage

export function uploadImage(id: string, fileUri: string, metadata?: any) {
  const storageRef = ref(getStorageService(), `profileImages/${id}`);

  return putFile(storageRef, fileUri, metadata);
}

export async function getProfileImageFromFirebase(
  uid: string,
  callback: Function,
) {
  try {
    // First, try to get uploaded image from Firebase Storage
    const url = await getDownloadURL(
      ref(getStorageService(), `profileImages/${uid}`),
    );
    callback({ type: ActionTypes.PROFILE_IMG, imgUrl: url });
  } catch (error: any) {
    if (error.code === "storage/object-not-found") {
      // If no uploaded image, check user data for Google profile image
      try {
        const userData = await getUserData(uid);
        if (userData.profileImg) {
          callback({
            type: ActionTypes.PROFILE_IMG,
            imgUrl: userData.profileImg,
          });
        } else {
          callback({ type: ActionTypes.PROFILE_IMG, imgUrl: null });
        }
      } catch (userDataError: any) {
        console.log(
          "Error fetching user data for profile image:",
          userDataError.message,
        );
        callback({ type: ActionTypes.PROFILE_IMG, imgUrl: null });
      }
    } else {
      console.log("Profile img error:", error.message);
      callback({ type: ActionTypes.PROFILE_IMG, imgUrl: null });
    }
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
