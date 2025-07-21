import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
} from "react";

import { authStore } from "./authStore";
import type {
  Product,
  NewProduct,
  ProductsContextMethods,
  ProductsStoreValue,
} from "./types";
import {
  getAllProducts,
  saveProduct,
  getProductById,
  modifyProduct,
  deleteProduct,
  moveProduct,
} from "../../api/api";

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
    <Provider value={{ productsList, productsContext }}>{children}</Provider>
  );
};

export { productsStore, ProductsProvider };
