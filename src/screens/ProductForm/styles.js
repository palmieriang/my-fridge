import { adjust } from "@components/utils/dimensions";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  inputContainer: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderRadius: 5,
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 30,
    marginRight: 30,
    maxHeight: 54,
    overflow: "hidden",
  },
});

export const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    borderColor: "#ccc",
    fontSize: adjust(14),
    height: "100%",
    paddingLeft: 66,
  },
  inputAndroid: {
    borderColor: "#ccc",
    fontSize: adjust(14),
    height: "100%",
    marginLeft: 60,
    paddingLeft: 66,
  },
  iconContainer: {
    alignItems: "center",
    borderRightColor: "#ccc",
    borderRightWidth: StyleSheet.hairlineWidth,
    fontSize: adjust(14),
    justifyContent: "center",
    height: "100%",
    left: 0,
    width: 54,
  },
  placeholder: {
    color: "#757575",
  },
});
