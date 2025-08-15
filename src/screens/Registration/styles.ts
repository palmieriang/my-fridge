import { StyleSheet } from "react-native";
import { COLORS } from "src/constants/colors";

import { Typography } from "../../typography/responsive";

export default StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
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
    color: COLORS.DARK_GRAY,
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginHorizontal: 20,
    marginVertical: 15,
    gap: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: COLORS.MEDIUM_DARK_GRAY,
    borderRadius: 3,
    backgroundColor: COLORS.WHITE,
    textAlign: "center",
    lineHeight: 16,
    fontSize: 12,
    fontWeight: "bold",
  },
  checkboxChecked: {
    borderColor: COLORS.PRIMARY_BLUE,
    backgroundColor: COLORS.PRIMARY_BLUE,
    color: COLORS.WHITE,
  },
  termsText: {
    flex: 1,
    fontSize: Typography.caption,
    fontFamily: "OpenSans-Regular",
    color: COLORS.DARK_GRAY,
    lineHeight: 18,
  },
  termsLink: {
    color: COLORS.PRIMARY_BLUE,
    fontFamily: "OpenSans-Bold",
  },
  footerView: {
    alignItems: "center",
    flex: 1,
    marginTop: 20,
  },
  footerText: {
    color: COLORS.DARK_GRAY,
    fontFamily: "OpenSans-Regular",
    fontSize: Typography.caption,
    padding: 10,
  },
  footerLink: {
    color: COLORS.PRIMARY_BLUE,
    fontFamily: "OpenSans-Bold",
    fontSize: Typography.body,
    padding: 10,
  },
});
