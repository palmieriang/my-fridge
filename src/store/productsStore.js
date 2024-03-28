import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";

import { authStore } from "./authStore";
import {
  getAllProducts,
  saveProduct,
  getProductById,
  modifyProduct,
  deleteProduct,
  moveProduct,
} from "../../api/api";

const productsStore = createContext();
const { Provider } = productsStore;

const ProductsProvider = ({ children }) => {
  const {
    authState: { user },
  } = useContext(authStore);

  const [productsList, setProductsList] = useState([]);
  const userID = user?.uid;

  useEffect(() => {
    if (userID) {
      const unsubscribe = getAllProducts(userID, setProductsList);
      return () => {
        unsubscribe();
      };
    }
  }, [userID]);

  const productsContext = useMemo(() => ({
    handleSaveProduct: async (data) => {
      return saveProduct(data).catch((error) => console.log("Error: ", error));
    },
    handleGetProduct: async (id) => {
      return getProductById(id)
        .then((response) => {
          return response;
        })
        .catch((error) => console.log("Error: ", error));
    },
    handleModifyProduct: async (data, id) => {
      return modifyProduct(data, id).catch((error) =>
        console.log("Error: ", error),
      );
    },
    handleDeleteProduct: async (id) => {
      return deleteProduct(id).catch((error) => console.log("Error: ", error));
    },
    handleFreezeProduct: (id, moveTo) => {
      moveProduct(id, moveTo).catch((error) => console.log("Error: ", error));
    },
  }));

  return (
    <Provider value={{ productsList, productsContext }}>{children}</Provider>
  );
};

export { productsStore, ProductsProvider };
