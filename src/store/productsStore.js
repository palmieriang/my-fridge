import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo
} from 'react';
import {
  getAllProducts,
  saveProduct,
  getProductById,
  modifyProduct,
  deleteProduct
} from '../../api/api';
import { authStore } from './authStore';

const productsStore = createContext();
const { Provider, Consumer } = productsStore;

const ProductsProvider = ({ children }) => {
  const {
    authState: { user }
  } = useContext(authStore);

  const [productsList, setProductsList] = useState([]);
  const userID = user?.uid;

  useEffect(() => {
    if (user) {
      getProducts(userID);
    }
  }, [user]);

  const getProducts = userID => {
    getAllProducts(userID)
      .then(response => {
        const newProducts = response.map(product => ({
          ...product,
          date: new Date(product.date)
        }));

        setProductsList(newProducts);
      })
      .catch(error => console.log('Error: ', error));
  };

  const productsContext = useMemo(() => ({
    handleSaveProduct: async data => {
      return saveProduct(data)
        .then(() => {
          getProducts(userID);
        })
        .catch(error => console.log('Error: ', error));
    },
    handleGetProduct: async id => {
      return getProductById(id)
        .then(response => {
          const product = response.data();
          return product;
        })
        .catch(error => console.log('Error: ', error));
    },
    handleModifyProduct: async (data, id) => {
      return modifyProduct(data, id)
        .then(() => {
          getProducts(userID);
        })
        .catch(error => console.log('Error: ', error));
    },
    handleDeleteProduct: id => {
      return deleteProduct(id)
        .then(() => {
          getProducts(userID);
        })
        .catch(error => console.log('Error: ', error));
    }
  }));

  return (
    <Provider value={{ productsList, productsContext }}>
      <Consumer>{children}</Consumer>
    </Provider>
  );
};

export { productsStore, ProductsProvider };
