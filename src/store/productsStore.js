import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { getCountdownParts } from '../../api/api';
import { firebase } from '../firebase/config';
import { authStore } from './authStore';

const productsStore = createContext();
const { Provider, Consumer } = productsStore;

const productRef = firebase.firestore().collection('products');

const ProductsProvider = ({ children }) => {
  const { authState: { user } } = useContext(authStore);

  const [expiredItems, setExpiredItems] = useState(null);
  const [productsList, setProductsList] = useState([]);

  useEffect(() => {
    if (user) {
      const userID = user.uid;
      getProductsFromApi(userID);
    }
  }, [user]);

  useEffect(() => {
    if (productsList) {
      countExpiredItems();
    }
  }, [productsList]);

  const getProductsFromApi = (userID) => {
    productRef
      .where('authorID', '==', userID)
      .where("place", "==", 'fridge')
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        querySnapshot => {
          const newProducts = [];
          querySnapshot.forEach(doc => {
            const product = doc.data();
            product.id = doc.id;
            newProducts.push(product);
          });
          setProductsList(
            newProducts.map(product => ({
              ...product,
              date: new Date(product.date),
              timer: Date.now()
            }))
          );
        },
        error => {
          console.log(error);
        }
      );
  };

  const countExpiredItems = () => {
    let counter = null;
    for (let i = 0; i < productsList.length; i++) {
      const { days } = getCountdownParts(productsList[i].date);
      if (days < 0) {
        counter++;
      }
    }
    setExpiredItems(counter);
  };

  return (
    <Provider value={{ expiredItems, productsList }}>
      <Consumer>
        {children}
      </Consumer>
    </Provider>
  );
};

export { productsStore, ProductsProvider };
