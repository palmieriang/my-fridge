import 'react-native-get-random-values';
import moment from 'moment';
import { firebase } from '../src/firebase/config';

const db = firebase.firestore();
const userRef = db.collection('users');
const productRef = db.collection('products');
const imagesRef = firebase.storage().ref();

// Auth

export function persistentLogin() {
  return new Promise(
    resolve => {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          user.getIdToken(true)
            .then((idToken) => {
              resolve({
                user,
                idToken
              })
            })
            .catch((error) => {
              console.log('Restoring token failed', error);
          });
        }
      })
    }
  );
}

export function getUserData(userID) {
  return userRef
    .doc(userID)
    .get()
    .then((response) => {
      return response.data();
    })
    .catch(error => console.log('Error: ', error));
}

// Products

export function saveProduct({ name, date, place, authorID }) {
  const timestamp = firebase.firestore.FieldValue.serverTimestamp();
  const data = {
    name,
    date,
    place,
    authorID,
    createdAt: timestamp,
  };
  return productRef
    .doc()
    .set(data)
    .catch((error) => {
      alert(error)
    });
}

export const getProductsFromApi = (userID, place) => {
  return new Promise(
    resolve => {
      productRef
        .where('authorID', '==', userID)
        .where('place', '==', place)
        .orderBy('createdAt', 'desc')
        .onSnapshot(
          querySnapshot => {
            const newProducts = [];
            querySnapshot.forEach(doc => {
              const product = doc.data();
              product.id = doc.id;
              newProducts.push(product);
            });
            resolve(newProducts);
          },
          error => {
            console.log(error);
          }
        );
    }
  )
};

export const getAllProducts = (userID) => {
  return new Promise(
    resolve => {
      productRef
        .where('authorID', '==', userID)
        .orderBy('createdAt', 'desc')
        .onSnapshot(
          querySnapshot => {
            const newProducts = [];
            querySnapshot.forEach(doc => {
              const product = doc.data();
              product.id = doc.id;
              newProducts.push(product);
            });
            resolve(newProducts);
          },
          error => {
            console.log(error);
          }
        );
    }
  )
};

export function getProductById(id) {
  return productRef
    .doc(id)
    .get()
    .catch(error => console.log('Error: ', error));
}

export function modifyProduct({ name, date, place, authorID }, existingId) {
  const timestamp = firebase.firestore.FieldValue.serverTimestamp();
  const data = {
    name,
    date,
    place,
    authorID,
    createdAt: timestamp,
  };
  return productRef
    .doc(existingId)
    .set(data)
    .catch((error) => {
      alert(error)
    });
}

export function moveProduct(id, place) {
  return productRef
    .doc(id)
    .update({
      place,
    })
    .catch(error => console.log('Error: ', error));
}

export function deleteProduct(existingId) {
  return productRef
    .doc(existingId)
      .delete()
      .catch(error => console.log('Error: ', error));
}

// Settings

export const uploadImageToFirebase = async (uri, userUID) => {
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
      resolve(xhr.response);
    };
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);
    xhr.send(null);
  });

  const ref = imagesRef.child(`profileImages/${userUID}`);

  let snapshot = await ref.put(blob);

  return await snapshot.ref.getDownloadURL();
};

export function getProfileImageFromFirebase(userUID) {
  return imagesRef
    .child(`profileImages/${userUID}`)
    .getDownloadURL();
}

export function deleteProfileImage(userUID) {
  return imagesRef
    .child(`profileImages/${userUID}`)
    .delete();
}

export function changeColor(newTheme, id) {
  const data = {
    theme: newTheme
  };
  return userRef
    .doc(id)
    .set(data, { merge: true })
    .catch(error => console.log('Error: ', error));
}

export function changeLanguage(newLocale, id) {
  const data = {
    locale: newLocale
  };
  return userRef
    .doc(id)
    .set(data, { merge: true })
    .catch(error => console.log('Error: ', error));
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
  const duration = moment.duration(moment(new Date(eventDate)).diff(new Date()));

  return {
    days: parseInt(duration.as('days')),
    hours: duration.get('hours'),
    minutes: duration.get('minutes'),
    seconds: duration.get('seconds'),
  };
}
