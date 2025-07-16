import { Timestamp } from "@react-native-firebase/firestore";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
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

export interface Product {
  id: string;
  name: string;
  date: string;
  place: "fridge" | "freezer";
  authorID: string;
  createdAt?: Timestamp;
}

export type NewProduct = Omit<Product, "id" | "createdAt">;

interface ProductsContextMethods {
  handleSaveProduct: (data: NewProduct) => Promise<void>;
  handleGetProduct: (id: string) => Promise<Product | undefined>;
  handleModifyProduct: (data: NewProduct, id?: string) => Promise<void>;
  handleDeleteProduct: (id: string) => Promise<void>;
  handleFreezeProduct: (id: string, moveTo: string) => void;
}

interface ProductsStoreValue {
  productsList: Product[];
  productsContext: ProductsContextMethods;
}

const productsStore = createContext<ProductsStoreValue>({
  productsList: [],
  productsContext: {
    handleSaveProduct: async () => {},
    handleGetProduct: async () => undefined,
    handleModifyProduct: async () => {},
    handleDeleteProduct: async () => {},
    handleFreezeProduct: () => {},
  },
});

interface ProductsProviderProps {
  children: ReactNode;
}

const { Provider } = productsStore;

const ProductsProvider = ({ children }: ProductsProviderProps) => {
  const {
    authState: { user },
  } = useContext(authStore);

  const [productsList, setProductsList] = useState<Product[]>([]);
  const userID = user?.uid;

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
      handleModifyProduct: async (data, id) => {
        try {
          await modifyProduct(data, id);
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
      handleFreezeProduct: async (id, moveTo) => {
        try {
          await moveProduct(id, moveTo);
        } catch (error) {
          console.log("Error: ", error);
        }
      },
    }),
    [],
  );

  return (
    <Provider value={{ productsList, productsContext }}>{children}</Provider>
  );
};

export { productsStore, ProductsProvider };
