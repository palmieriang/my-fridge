import { Alert } from "react-native";

type ValidateProductProps = {
  name: string;
  date: string | null;
  place: string;
  t: (key: string) => string;
};

const isValidPlace = (p: string): p is "fridge" | "freezer" =>
  p === "fridge" || p === "freezer";

export const validateProduct = ({
  name,
  date,
  place,
  t,
}: ValidateProductProps): boolean => {
  if (name.length < 3) {
    Alert.alert(t("validationError"), t("nameLength"));
    return false;
  }
  if (!date) {
    Alert.alert(t("validationError"), t("selectDate"));
    return false;
  }
  if (!isValidPlace(place)) {
    Alert.alert(t("validationError"), t("selectPlace"));
    return false;
  }
  return true;
};
