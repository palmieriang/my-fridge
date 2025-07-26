import { StyleSheet } from "react-native";

import { responsive } from "../../utils/responsive";

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
    marginLeft: responsive.containerPadding,
    marginRight: responsive.containerPadding,
    overflow: "hidden",
  },
  iosHeight: {
    height: 120,
  },
});
