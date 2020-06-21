import 'react-native-get-random-values';
import moment from 'moment';
import { firebase } from '../src/firebase/config';

const productRef = firebase.firestore().collection('products');

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

export function modifyProduct({ name, date, place, authorID }, existingId) {
  console.info(name, date, place, authorID, existingId);
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
