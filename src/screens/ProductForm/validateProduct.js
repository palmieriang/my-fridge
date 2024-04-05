import { Alert } from "react-native";

export const validateProduct = (name, date, place, t) => {
  if (name.length < 3) {
    Alert.alert(t("validationError"), t("nameLength"));
    return false;
  }
  if (!date) {
    Alert.alert(t("validationError"), t("selectDate"));
    return false;
  }
  if (!place) {
    Alert.alert(t("validationError"), t("selectPlace"));
    return false;
  }
  return true;
};
