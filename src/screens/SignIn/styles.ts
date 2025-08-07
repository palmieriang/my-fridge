import { StyleSheet } from "react-native";

import { COLORS } from "../../constants/colors";
import { Typography } from "../../typography/responsive";
import { responsive, vh } from "../../utils/responsive";

export default StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: responsive.containerPadding,
  },
  animationContainer: {
    alignItems: "center",
    height: vh(35),
    justifyContent: "center",
    marginBottom: 20,
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: responsive.containerPadding,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    gap: 10,
  },
  loadingText: {
    fontFamily: "OpenSans-Regular",
    fontSize: Typography.caption,
  },
  footerView: {
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: responsive.containerPadding,
  },
  footerText: {
    color: COLORS.DARK_GRAY,
    fontFamily: "OpenSans-Regular",
    fontSize: Typography.caption,
    textAlign: "center",
    marginVertical: 5,
  },
  footerLink: {
    color: COLORS.PRIMARY_BLUE,
    fontFamily: "OpenSans-Bold",
    fontSize: Typography.body,
    textAlign: "center",
  },
  resetLink: {
    marginBottom: 15,
    paddingVertical: 10,
  },
});
