import { useContext, useState, useEffect, useMemo, ReactNode } from "react";

import { authStore } from "./authStore";
import { ShoppingListStoreContext } from "./contexts";
import type { ShoppingItem, ShoppingListContextMethods } from "./types";
import {
  saveShoppingItem,
  getShoppingItems,
  toggleShoppingItem,
  updateShoppingItemName,
  deleteShoppingItem,
  clearCheckedShoppingItems,
} from "../../api/api";

interface ShoppingListProviderProps {
  children: ReactNode;
}

const { Provider } = ShoppingListStoreContext;

const ShoppingListProvider = ({ children }: ShoppingListProviderProps) => {
  const authContext = useContext(authStore);
  const user = authContext?.authState?.user;
  const userID = user?.uid;

  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>([]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    if (userID) {
      unsubscribe = getShoppingItems(userID, (items: ShoppingItem[]) => {
        setShoppingItems(items);
      });
    } else {
      setShoppingItems([]);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [userID]);

  const shoppingListContext = useMemo<ShoppingListContextMethods>(
    () => ({
      handleAddItem: async (name: string) => {
        if (!userID) return;
        try {
          await saveShoppingItem({ name, checked: false }, userID);
        } catch (error) {
          console.log("Error adding shopping item:", error);
        }
      },
      handleToggleItem: async (id: string, checked: boolean) => {
        if (!userID) return;
        try {
          await toggleShoppingItem(id, checked, userID);
        } catch (error) {
          console.log("Error toggling shopping item:", error);
        }
      },
      handleUpdateItemName: async (id: string, name: string) => {
        if (!userID) return;
        try {
          await updateShoppingItemName(id, name, userID);
        } catch (error) {
          console.log("Error updating shopping item name:", error);
        }
      },
      handleDeleteItem: async (id: string) => {
        if (!userID) return;
        try {
          await deleteShoppingItem(id, userID);
        } catch (error) {
          console.log("Error deleting shopping item:", error);
        }
      },
      handleClearChecked: async () => {
        if (!userID) return;
        const checkedIds = shoppingItems
          .filter((i) => i.checked)
          .map((i) => i.id);
        if (!checkedIds.length) return;
        try {
          await clearCheckedShoppingItems(checkedIds, userID);
        } catch (error) {
          console.log("Error clearing checked items:", error);
        }
      },
    }),
    [userID, shoppingItems],
  );

  return (
    <Provider value={{ shoppingItems, shoppingListContext }}>
      {children}
    </Provider>
  );
};

export { ShoppingListStoreContext as shoppingListStore, ShoppingListProvider };
