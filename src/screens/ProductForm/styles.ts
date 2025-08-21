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
});
