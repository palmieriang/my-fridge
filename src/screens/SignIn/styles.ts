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
  headerContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: vh(8),
    paddingBottom: vh(4),
    gap: 16,
  },
  iconBadge: {
    width: 128,
    height: 128,
    borderRadius: 32,
    backgroundColor: COLORS.WHITE,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.PRIMARY_BLUE,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 6,
  },
  appTitle: {
    fontFamily: "LilitaOne-Regular",
    fontSize: Typography.display,
    color: COLORS.PRIMARY_BLUE,
    letterSpacing: 1,
  },
  formContainer: {
    paddingHorizontal: responsive.containerPadding,
    gap: 4,
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
