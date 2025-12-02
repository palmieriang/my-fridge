import { StyleSheet } from "react-native";

import { Typography } from "../../typography/responsive";
import { responsive } from "../../utils/responsive";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  label: {
    fontSize: Typography.body,
    fontFamily: "OpenSans-SemiBold",
    marginHorizontal: responsive.containerMargin,
    marginTop: 8,
    marginBottom: 4,
  },
  buttonContainer: {
    marginTop: 20,
  },
  scanButtonContainer: {
    marginHorizontal: responsive.containerMargin,
    marginTop: 16,
    marginBottom: 16,
  },
  scanButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 2,
  },
  scanButtonText: {
    fontSize: Typography.body,
    fontFamily: "OpenSans-SemiBold",
    marginLeft: 10,
  },
  scanningContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },
  scanningText: {
    marginLeft: 10,
    fontSize: Typography.body,
    fontFamily: "OpenSans-Regular",
  },
});
