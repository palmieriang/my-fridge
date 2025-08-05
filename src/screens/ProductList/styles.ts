import { StyleSheet } from "react-native";

import { COLORS } from "../../constants/colors";
import { Typography } from "../../typography/responsive";
import { responsive } from "../../utils/responsive";

export default StyleSheet.create({
  list: {
    flex: 1,
    paddingTop: 10,
  },
  text: {
    height: 50,
    margin: 0,
    marginRight: 7,
    paddingLeft: 20,
    marginTop: 20,
  },
  controlsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: responsive.containerMargin,
    paddingTop: 10,
    paddingBottom: 5,
    gap: 8,
  },
  searchContainer: {
    flex: 1,
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    height: 48,
    borderRadius: 4,
    paddingHorizontal: 15,
    paddingRight: 45,
    borderWidth: 1,
    borderColor: COLORS.MEDIUM_LIGHT_GRAY,
    fontSize: Typography.body,
    fontFamily: "OpenSans-Regular",
  },
  clearButton: {
    position: "absolute",
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.MEDIUM_DARK_GRAY,
    justifyContent: "center",
    alignItems: "center",
  },
  clearButtonText: {
    color: COLORS.WHITE,
    fontSize: Typography.body,
    fontWeight: "bold",
  },
  sortButton: {
    width: 48,
    height: 48,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.MEDIUM_LIGHT_GRAY,
  },
  sortButtonText: {
    fontSize: Typography.subtitle,
  },
  sortIndicator: {
    paddingHorizontal: responsive.containerPadding,
    paddingVertical: 8,
    backgroundColor: COLORS.LIGHT_GRAY,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.MEDIUM_LIGHT_GRAY,
  },
  sortIndicatorText: {
    fontSize: Typography.caption,
    fontFamily: "OpenSans-Regular",
    textAlign: "center",
    fontStyle: "italic",
  },
  noResultsText: {
    textAlign: "center",
    fontSize: Typography.body,
    fontFamily: "OpenSans-Regular",
    marginTop: 50,
    paddingHorizontal: 20,
  },
});
