import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import Constants from 'expo-constants';
import { seed } from '../src/utils/uuidSeed';

const { manifest } = Constants;

const api = (typeof manifest.packagerOpts === `object`) && manifest.packagerOpts.dev
  ? manifest.debuggerHost.split(`:`).shift().concat(`:3000`)
  : `api.example.com`;

const url = `http://${api}/products/`;

export function getProducts(place) {
  return fetch(`${url}?place=${place}`)
    .then(response => response.json())
    .then(products => products.map(product => ({ ...product, date: new Date(product.date) })))
    .catch(error => console.error('Error:', error));
}

export function getProductById(id) {
  return fetch(url+id)
    .then(response => response.json())
    .catch(error => console.error('Error:', error));
}

export function saveProduct(name, date, place, id) {
  if(id) {
    return fetch(url+id, {
      method: 'PUT',
      body: JSON.stringify({
        name,
        date,
        place,
        id: id,
      }),
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    })
    .then(res => res.json())
    .catch(error => console.error('Error:', error));
  }
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      name,
      date,
      place,
      id: uuidv4({ random: seed() }),
    }),
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  })
  .then(res => res.json())
  .catch(error => console.error('Error:', error));
}

export function deleteProduct(id) {
  return fetch(url+id, {
    method: 'DELETE',
  })
  .then(res => res.json())
  .catch(error => console.error('Error:', error));
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
