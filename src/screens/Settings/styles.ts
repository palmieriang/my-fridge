import { adjust } from "@components/utils/dimensions";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  androidPicker: {
    width: "100%",
  },
  container: {
    flex: 1,
    width: "100%",
  },
  selectorContainer: {
    backgroundColor: "#fff",
    borderRadius: 5,
    marginTop: 20,
    minWidth: 200,
  },
  initValueTextStyle: {
    color: "black",
    fontFamily: "OpenSans-Regular",
  },
  text: {
    fontFamily: "OpenSans-Regular",
  },
  optionContainer: {
    backgroundColor: "lightgrey",
  },
  auth: {
    marginTop: 20,
  },
  authLink: {
    color: "#dd2c00",
    fontFamily: "OpenSans-Bold",
    fontSize: adjust(14),
    marginTop: 20,
  },
});
