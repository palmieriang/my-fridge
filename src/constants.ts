export const FRIDGE = "fridge";
export const FREEZER = "freezer";
export const SETTINGS = "settings";
export const SHOPPING_LIST = "shoppingList";

// Mirror the max lengths enforced by firestore.rules to avoid rejected writes.
export const PRODUCT_NAME_MAX_LENGTH = 100;
export const SHOPPING_ITEM_NAME_MAX_LENGTH = 120;

export const ActionTypes = {
  RESTORE_TOKEN: "RESTORE_TOKEN",
  SIGN_IN: "SIGN_IN",
  SIGN_OUT: "SIGN_OUT",
  PROFILE_IMG: "PROFILE_IMG",
};
