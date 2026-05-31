import { useContext, useState, useEffect, useMemo, ReactNode } from "react";

import { ProductsStoreContext } from "./contexts";
import { FRIDGE, FREEZER } from "../constants";
import { authStore } from "./authStore";
import type { Product, NewProduct, ProductsContextMethods } from "./types";
import {
  getAllProducts,
  saveProduct,
  getProductById,
  modifyProduct,
  deleteProduct,
  moveProduct,
} from "../../api/api";

interface ProductsProviderProps {
  children: ReactNode;
}

const { Provider } = ProductsStoreContext;

const ProductsProvider = ({ children }: ProductsProviderProps) => {
  const authContext = useContext(authStore);
  const user = authContext?.authState?.user;

  const [productsList, setProductsList] = useState<Product[]>([]);
  const userID = user?.uid;

  const fridgeProducts = useMemo(
    () => productsList.filter((item) => item.place === FRIDGE),
    [productsList],
  );

  const freezerProducts = useMemo(
    () => productsList.filter((item) => item.place === FREEZER),
    [productsList],
  );

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    if (userID) {
      unsubscribe = getAllProducts(userID, (products: Product[]) => {
        setProductsList(products);
      });
    } else {
      setProductsList([]);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [userID]);

  const productsContext = useMemo<ProductsContextMethods>(
    () => ({
      handleSaveProduct: async (data: NewProduct) => {
        if (!userID) return;
        try {
          await saveProduct(data, userID);
        } catch (error) {
          console.log("Error: ", error);
        }
      },
      handleGetProduct: async (id) => {
        if (!userID) return undefined;
        try {
          return await getProductById(id, userID);
        } catch (error) {
          console.log("Error: ", error);
          return undefined;
        }
      },
      handleModifyProduct: async (product, id) => {
        if (!userID) return;
        try {
          await modifyProduct(product, id, userID);
        } catch (error) {
          console.log("Error: ", error);
        }
      },
      handleDeleteProduct: async (id) => {
        if (!userID) return;
        try {
          await deleteProduct(id, userID);
        } catch (error) {
          console.log("Error: ", error);
        }
      },
      handleFreezeProduct: async (id: string, place: "fridge" | "freezer") => {
        if (!userID) return;
        try {
          await moveProduct(id, place, userID);
        } catch (error) {
          console.log("Error: ", error);
        }
      },
    }),
    [userID],
  );

  return (
    <Provider
      value={{
        productsList,
        fridgeProducts,
        freezerProducts,
        productsContext,
      }}
    >
      {children}
    </Provider>
  );
};

export { ProductsStoreContext as productsStore, ProductsProvider };
