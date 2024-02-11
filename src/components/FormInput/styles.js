import { StyleSheet } from "react-native";

import { adjust } from "../utils/dimensions";

export default StyleSheet.create({
  inputContainer: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderRadius: 5,
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 30,
    marginRight: 30,
    maxHeight: 56,
    overflow: "hidden",
  },
  iconStyle: {
    alignItems: "center",
    borderRightColor: "#ccc",
    borderRightWidth: StyleSheet.hairlineWidth,
    padding: 14,
  },
  input: {
    backgroundColor: "white",
    flex: 1,
    fontFamily: "OpenSans-Regular",
    fontSize: adjust(14),
    justifyContent: "center",
    padding: 14,
  },
});
