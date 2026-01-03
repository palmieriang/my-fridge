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
        try {
          await saveProduct(data);
        } catch (error) {
          console.log("Error: ", error);
        }
      },
      handleGetProduct: async (id) => {
        try {
          return await getProductById(id);
        } catch (error) {
          console.log("Error: ", error);
          return undefined;
        }
      },
      handleModifyProduct: async (product, id) => {
        try {
          await modifyProduct(product, id);
        } catch (error) {
          console.log("Error: ", error);
        }
      },
      handleDeleteProduct: async (id) => {
        try {
          await deleteProduct(id);
        } catch (error) {
          console.log("Error: ", error);
        }
      },
      handleFreezeProduct: async (id: string, place: "fridge" | "freezer") => {
        try {
          await moveProduct(id, place);
        } catch (error) {
          console.log("Error: ", error);
        }
      },
    }),
    [],
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
