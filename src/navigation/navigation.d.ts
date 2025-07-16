import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Product } from "src/store/productsStore";

export type RootStackParamList = {
  list: { place: "fridge" | "freezer" };
  form: { id?: string; product?: Product; title: string };
  settings: undefined;
  signin: undefined;
  registration: undefined;
};

export type FormScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "form"
>;

export type FormScreenRouteProp = RouteProp<RootStackParamList, "form">;

export type ProductListNavigationProp = StackNavigationProp<
  RootStackParamList,
  "list"
>;

export type ProductListRouteProp = RouteProp<RootStackParamList, "list">;
